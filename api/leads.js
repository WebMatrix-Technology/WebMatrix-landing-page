import { Router } from 'express';
import { ensureSupabase, authenticate as authenticateRequest } from './_lib/supabase.js';

const router = Router();

// Authentication middleware for admin endpoints
const authenticate = async (req, res, next) => {
  const result = await authenticateRequest(req);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  req.user = result.user;
  next();
};

const requireSupabase = (res) => {
  const client = ensureSupabase(res);
  if (!client) {
    console.error('[api/leads] Supabase client unavailable.');
  }
  return client;
};

// Public endpoint - anyone can submit a lead
router.post('/', async (req, res) => {
  const client = requireSupabase(res);
  if (!client) return;
  let payload;
  try {
    payload = normalizeLeadPayload(req.body);
  } catch (err) {
    return res.status(400).json({ error: err.message });
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
router.get('/', authenticate, async (_req, res) => {
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

router.get('/:id', authenticate, async (req, res) => {
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

router.delete('/:id', authenticate, async (req, res) => {
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

function normalizeLeadPayload(body) {
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
    timeline: timeline || null,
    message: message.trim(),
  };
}

export default router;

