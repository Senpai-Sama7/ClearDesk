const USER_ID_KEY = 'cleardesk_user_id';

export function getUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export function setUserId(id: string) {
  localStorage.setItem(USER_ID_KEY, id);
}

export async function syncToKV(documents: unknown[]): Promise<void> {
  try {
    await fetch('/api/documents', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: getUserId(), documents }),
    });
  } catch { /* background sync — fail silently */ }
}

export async function pullFromKV(userId?: string): Promise<unknown[] | null> {
  try {
    const r = await fetch(`/api/documents?userId=${userId || getUserId()}`);
    if (!r.ok) return null;
    const { documents } = await r.json();
    return Array.isArray(documents) && documents.length > 0 ? documents : null;
  } catch { return null; }
}
