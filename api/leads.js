import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

const router = Router();

// Authentication middleware for admin endpoints
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.replace('Bearer ', '').trim();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = data.user;
  next();
};

// Public endpoint - anyone can submit a lead
router.post('/', async (req, res) => {
  let payload;
  try {
    payload = normalizeLeadPayload(req.body);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  try {
    const { data, error } = await supabase
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
  try {
    const { data, error } = await supabase
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
  try {
    const { data, error } = await supabase
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
  try {
    const { data, error } = await supabase
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

