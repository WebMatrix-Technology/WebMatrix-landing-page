import { Router } from 'express';
import { ensureSupabase, authenticate as authenticateRequest } from './_lib/supabase.js';

const router = Router();

const requireSupabase = (res) => {
  const client = ensureSupabase(res);
  if (!client) {
    console.error('[api/posts] Supabase client unavailable.');
  }
  return client;
};

const authenticate = async (req, res, next) => {
  const result = await authenticateRequest(req);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }
  req.user = result.user;
  next();
};

// Public GET endpoints, auth required for mutations
router.get('/', async (_req, res) => {
  const client = requireSupabase(res);
  if (!client) return;
  try {
    const { data, error } = await client
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('[api/posts] Supabase error:', error);
      // If table doesn't exist, return empty array instead of error
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return res.json([]);
      }
      return res.status(500).json({ error: error.message });
    }
    res.json(data || []);
  } catch (err) {
    console.error('[api/posts] Unexpected error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  const client = requireSupabase(res);
  if (!client) return;
  try {
    const { data, error } = await client
      .from('blog_posts')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Post not found' });
      }
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return res.status(404).json({ error: 'Post not found' });
      }
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('[api/posts/:id] Unexpected error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
  }
});

// Auth required for mutations
router.post('/', authenticate, async (req, res) => {
  const client = requireSupabase(res);
  if (!client) return;
  let payload;
  try {
    payload = normalizePayload(req.body);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  const { data, error } = await client
    .from('blog_posts')
    .insert(payload)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/:id', authenticate, async (req, res) => {
  const client = requireSupabase(res);
  if (!client) return;
  let payload;
  try {
    payload = normalizePayload(req.body, false);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  const { data, error } = await client
    .from('blog_posts')
    .update(payload)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    const status = error.code === 'PGRST116' ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
  res.json(data);
});

router.delete('/:id', authenticate, async (req, res) => {
  const client = requireSupabase(res);
  if (!client) return;
  const { data, error } = await client
    .from('blog_posts')
    .delete()
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    const status = error.code === 'PGRST116' ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
  res.json(data);
});

function normalizePayload(body, requireAll = true) {
  const {
    title,
    excerpt,
    category,
    content,
    readTime,
    tags,
    heroImage,
    publishedAt,
  } = body;

  if (requireAll) {
    if (!title || !excerpt || !category || !content) {
      throw new Error('Missing required fields: title, excerpt, category, content');
    }
  }

  return {
    title,
    excerpt,
    category,
    content,
    read_time: readTime || null,
    tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : []),
    hero_image: heroImage || null,
    published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
  };
}

export default router;
