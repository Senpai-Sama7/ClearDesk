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
    return res.status(500).json({ error: 'Cloudflare KV not configured' });
  }

  const userId = (req.method === 'GET' ? req.query.userId : req.body?.userId) as string;
  if (!userId || !/^[a-f0-9-]{36}$/.test(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  const key = `documents:${userId}`;

  try {
    if (req.method === 'GET') {
      const r = await fetch(kvUrl(key), { headers: headers() });
      if (r.status === 404) return res.json({ documents: [] });
      if (!r.ok) return res.status(502).json({ error: 'KV read failed' });
      const data = await r.text();
      return res.json({ documents: JSON.parse(data) });
    }

    if (req.method === 'PUT') {
      const { documents } = req.body;
      if (!Array.isArray(documents)) return res.status(400).json({ error: 'documents must be an array' });
      const r = await fetch(kvUrl(key), { method: 'PUT', headers: headers(), body: JSON.stringify(documents) });
      if (!r.ok) return res.status(502).json({ error: 'KV write failed' });
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: 'Sync failed' });
  }
}
