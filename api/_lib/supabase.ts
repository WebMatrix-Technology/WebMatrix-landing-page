import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Request, Response } from 'express';

// Lazy initialization - check environment variables each time
let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  // Re-check environment variables each time (they might be loaded later)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    if (!supabaseClient) {
      // Only log error once to avoid spam
      console.error('[api] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
      console.error('[api] SUPABASE_URL:', supabaseUrl ? 'set' : 'missing');
      console.error('[api] SUPABASE_SERVICE_ROLE_KEY:', serviceKey ? 'set' : 'missing');
    }
    return null;
  }

  // Create client if not already created or if credentials changed
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
      console.log('[api] Supabase client initialized successfully');
    } catch (error) {
      console.error('[api] Failed to create Supabase client:', error);
      return null;
    }
  }

  return supabaseClient;
}

export function ensureSupabase(res: Response): SupabaseClient | null {
  const client = getSupabaseClient();
  if (!client) {
    const message = 'Supabase is not configured on the server. Check environment variables.';
    console.error('[api]', message);
    if (!res.headersSent) {
      res.status(500).json({ error: message });
    }
    return null;
  }
  return client;
}

// Export getter for backward compatibility (lazy initialization)
// Use ensureSupabase() or getSupabaseClient() instead
export function getSupabase(): SupabaseClient | null {
  return getSupabaseClient();
}

type AuthUser = NonNullable<Awaited<ReturnType<SupabaseClient['auth']['getUser']>>['data']['user']>;

type AuthSuccess = { user: AuthUser };
type AuthFailure = { error: string; status: number };

export type AuthResult = AuthSuccess | AuthFailure;

export async function authenticate(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }
  const token = authHeader.replace('Bearer ', '').trim();
  const client = getSupabaseClient();
  if (!client) {
    return { error: 'Supabase not configured', status: 500 };
  }
  const { data, error } = await client.auth.getUser(token);
  if (error || !data?.user) {
    return { error: 'Unauthorized', status: 401 };
  }
  return { user: data.user };
}

