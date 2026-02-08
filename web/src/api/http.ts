const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3333/api';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    let msg = 'Request failed';
    try {
      const data = await res.json();
      msg = data?.message ?? msg;
    } catch {}
    throw new Error(msg);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
