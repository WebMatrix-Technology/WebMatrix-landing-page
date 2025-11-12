import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { Router } from 'express';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ensureSupabase, authenticate as authenticateRequest, type AuthResult } from './_lib/supabase.js';

const router = Router();

// Authentication middleware for admin endpoints
const authenticate: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const result: AuthResult = await authenticateRequest(req);
  if ('error' in result) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.locals.user = result.user;
  next();
};

const requireSupabase = (res: Response): SupabaseClient | null => {
  const client = ensureSupabase(res);
  if (!client) {
    console.error('[api/leads] Supabase client unavailable.');
  }
  return client;
};

// Public endpoint - anyone can submit a lead
router.post('/', async (req: Request, res: Response) => {
  const client = requireSupabase(res);
  if (!client) return;
  let payload: LeadRecord;
  try {
    payload = normalizeLeadPayload(req.body);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid payload';
    res.status(400).json({ error: message });
    return;
  }
  try {
    const { data, error } = await client
      .from('leads')
      .insert(payload)
      .select()
      .single();

    if (error) {
      // If table doesn't exist, log but don't fail (graceful degradation)
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        console.warn('[api/leads] Table does not exist, skipping database save');
        return res.status(201).json({ 
          id: Date.now().toString(),
          ...payload,
          created_at: new Date().toISOString(),
          message: 'Lead received (not saved to database - table missing)'
        });
      }
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (err) {
    console.error('[api/leads] Unexpected error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
  }
});

// Admin endpoints - require authentication
router.get('/', authenticate, async (_req: Request, res: Response) => {
  const client = requireSupabase(res);
  if (!client) return;
  try {
    const { data, error } = await client
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return res.json([]);
      }
      return res.status(500).json({ error: error.message });
    }
    res.json(data || []);
  } catch (err) {
    console.error('[api/leads] Unexpected error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
  }
});

router.get('/:id', authenticate, async (req: Request, res: Response) => {
  const client = requireSupabase(res);
  if (!client) return;
  try {
    const { data, error } = await client
      .from('leads')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Lead not found' });
      }
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return res.status(404).json({ error: 'Lead not found' });
      }
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('[api/leads/:id] Unexpected error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
  }
});

router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  const client = requireSupabase(res);
  if (!client) return;
  try {
    const { data, error } = await client
      .from('leads')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      const status = error.code === 'PGRST116' ? 404 : 500;
      return res.status(status).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('[api/leads/:id DELETE] Unexpected error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
  }
});

type LeadRecord = {
  name: string;
  email: string;
  budget: string | null;
  timeline: string | null;
  message: string;
};

type LeadInput = Partial<LeadRecord> & { name?: string; email?: string; message?: string };

function normalizeLeadPayload(body: LeadInput): LeadRecord {
  const {
    name,
    email,
    budget,
    timeline,
    message,
  } = body;

  // Required fields validation
  if (!name || !name.trim()) {
    throw new Error('Name is required');
  }
  if (!email || !email.trim()) {
    throw new Error('Email is required');
  }
  if (!message || !message.trim()) {
    throw new Error('Message is required');
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new Error('Invalid email format');
  }

  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    budget: budget?.trim() || null,
    timeline: timeline?.trim() || null,
    message: message.trim(),
  };
}

export default router;

