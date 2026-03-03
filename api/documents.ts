import type { VercelRequest, VercelResponse } from '@vercel/node';

const kvUrl = (key: string) => {
  const { CLOUDFLARE_ACCOUNT_ID: acct, CLOUDFLARE_KV_NAMESPACE_ID: ns } = process.env;
  return `https://api.cloudflare.com/client/v4/accounts/${acct}/storage/kv/namespaces/${ns}/values/${key}`;
};

const headers = () => ({
  'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
  'Content-Type': 'application/json',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_KV_NAMESPACE_ID, CLOUDFLARE_API_TOKEN } = process.env;
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_KV_NAMESPACE_ID || !CLOUDFLARE_API_TOKEN) {
    // Graceful degradation — sync unavailable but app still works
    if (req.method === 'GET') return res.json({ documents: [] });
    return res.json({ ok: true, warning: 'Cloud sync not configured — data saved locally only' });
  }

  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const userId = (req.method === 'GET' ? url.searchParams.get('userId') : req.body?.userId) as string;
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!userId || !UUID_RE.test(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  const key = `documents:${userId}`;

  try {
    if (req.method === 'GET') {
      const r = await fetch(kvUrl(key), { headers: headers() });
      if (r.status === 404) return res.json({ documents: [] });
      if (!r.ok) return res.status(502).json({ error: 'KV read failed' });
      const data = await r.text();
      try { return res.json({ documents: JSON.parse(data) }); }
      catch { return res.json({ documents: [] }); }
    }

    if (req.method === 'PUT') {
      const { documents } = req.body;
      if (!Array.isArray(documents)) return res.status(400).json({ error: 'documents must be an array' });
      if (documents.length > 500) return res.status(400).json({ error: 'Too many documents' });
      const r = await fetch(kvUrl(key), { method: 'PUT', headers: headers(), body: JSON.stringify(documents) });
      if (!r.ok) return res.status(502).json({ error: 'KV write failed' });
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: 'Sync failed' });
  }
}
