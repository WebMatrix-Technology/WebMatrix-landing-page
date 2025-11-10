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

// Public GET endpoints
router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    const status = error.code === 'PGRST116' ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
  res.json(data);
});

// Auth required for mutations
router.use(authenticate);

router.post('/', async (req, res) => {
  let payload;
  try {
    payload = normalizeProjectPayload(req.body);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('[api/projects] Insert error:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
  } catch (err) {
    console.error('[api/projects] Unexpected error in POST:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  let payload;
  try {
    payload = normalizeProjectPayload(req.body, false);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  
  try {
    // Ensure all fields are explicitly included, even if null, to properly update the database
    const updatePayload = {
      title: payload.title,
      description: payload.description,
      category: payload.category,
      tags: payload.tags,
      image: payload.image,
      mobile_image: payload.mobile_image,
      gallery: payload.gallery,
      metrics: payload.metrics,
      long_description: payload.long_description,
      website_url: payload.website_url,
      video_src: payload.video_src,
    };

    const { data, error } = await supabase
      .from('projects')
      .update(updatePayload)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      console.error('[api/projects] Update error:', error);
      const status = error.code === 'PGRST116' ? 404 : 500;
      return res.status(status).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('[api/projects] Unexpected error in PUT:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
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

function normalizeProjectPayload(body, requireAll = true) {
  const {
    title,
    description,
    category,
    tags,
    image,
    mobileImage,
    gallery,
    metrics,
    longDescription,
    websiteUrl,
    videoSrc,
  } = body;

  if (requireAll) {
    if (!title || !description || !category || !image) {
      throw new Error('Missing required fields: title, description, category, image');
    }
  }

  return {
    title,
    description,
    category,
    tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : []),
    image,
    mobile_image: mobileImage ?? null,
    gallery: Array.isArray(gallery) ? gallery : (typeof gallery === 'string' ? gallery.split(',').map((t) => t.trim()).filter(Boolean) : []),
    metrics: metrics ?? null,
    long_description: longDescription ?? null,
    website_url: websiteUrl ?? null,
    video_src: videoSrc ?? null,
  };
}

export default router;
