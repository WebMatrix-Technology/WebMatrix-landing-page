import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Request, Response } from 'express';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('[api] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

export const supabase: SupabaseClient | null = supabaseUrl && serviceKey
  ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
  : null;

export function ensureSupabase(res: Response): SupabaseClient | null {
  if (supabase) {
    return supabase;
  }
  const message = 'Supabase is not configured on the server. Check environment variables.';
  if (!res.headersSent) {
    res.status(500).json({ error: message });
  }
  return null;
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
  if (!supabase) {
    return { error: 'Supabase not configured', status: 500 };
  }
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return { error: 'Unauthorized', status: 401 };
  }
  return { user: data.user };
}

