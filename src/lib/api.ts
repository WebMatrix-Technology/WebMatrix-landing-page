// Use relative path in production (Vercel), absolute URL in development
const API_BASE = process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000');

export async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Add cache control for GET requests to prevent stale data
  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  // For GET requests, add cache control
  if (options.method === 'GET' || !options.method) {
    fetchOptions.cache = 'no-store';
  }

  const fullUrl = `${API_BASE}${path}`;
  console.log(`[API] ${options.method || 'GET'} ${fullUrl}`);

  const response = await fetch(fullUrl, fetchOptions);

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
