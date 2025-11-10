const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const data = await response.json();
      errorMessage = data?.error || errorMessage;
    } catch {
      // ignore
    }
    throw new Error(errorMessage || 'Request failed');
  }

  if (response.status === 204) return undefined as unknown as T;

  return response.json() as Promise<T>;
}
