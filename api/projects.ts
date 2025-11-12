import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { Router } from 'express';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ensureSupabase, authenticate as authenticateRequest, type AuthResult } from './_lib/supabase.js';

const router = Router();

const requireSupabase = (res: Response): SupabaseClient | null => {
  const client = ensureSupabase(res);
  if (!client) {
    console.error('[api/projects] Supabase client unavailable.');
  }
  return client;
};

const authenticate: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const result: AuthResult = await authenticateRequest(req);
  if ('error' in result) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.locals.user = result.user;
  next();
};

// Public GET endpoints
router.get('/', async (_req: Request, res: Response) => {
  const client = requireSupabase(res);
  if (!client) return;
  const { data, error } = await client
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  
  // Ensure featured columns exist with defaults if migration hasn't run yet
  const normalizedData = (data || []).map((project: any) => ({
    ...project,
    is_featured: project.is_featured ?? false,
    featured_order: project.featured_order ?? null,
  }));
  
  res.json(normalizedData);
});

router.get('/:id', async (req: Request, res: Response) => {
  const client = requireSupabase(res);
  if (!client) return;
  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    const status = error.code === 'PGRST116' ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
  
  // Ensure featured columns exist with defaults if migration hasn't run yet
  const normalizedData = {
    ...data,
    is_featured: data.is_featured ?? false,
    featured_order: data.featured_order ?? null,
  };
  
  res.json(normalizedData);
});

// Auth required for mutations
router.use(authenticate);

router.post('/', async (req: Request, res: Response) => {
  let payload: ProjectRecord;
  try {
    payload = normalizeProjectPayload(req.body);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid payload';
    res.status(400).json({ error: message });
    return;
  }
  
  try {
    const client = requireSupabase(res);
    if (!client) return;
    const { data, error } = await client
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

router.put('/:id', async (req: Request, res: Response) => {
  let payload: ProjectRecord;
  try {
    payload = normalizeProjectPayload(req.body, false);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid payload';
    res.status(400).json({ error: message });
    return;
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
      is_featured: payload.is_featured,
      featured_order: payload.featured_order,
    };

    const client = requireSupabase(res);
    if (!client) return;
    const { data, error } = await client
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

router.delete('/:id', async (req: Request, res: Response) => {
  const client = requireSupabase(res);
  if (!client) return;
  const { data, error } = await client
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

type MetricPayload = { improvement: string; metric: string };
type ProjectRecord = {
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  mobile_image: string | null;
  gallery: string[];
  metrics: MetricPayload | null;
  long_description: string | null;
  website_url: string | null;
  video_src: string | null;
  is_featured: boolean;
  featured_order: number | null;
};

type ProjectInput = {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[] | string;
  image?: string;
  mobileImage?: string | null;
  gallery?: string[] | string;
  metrics?: MetricPayload | null;
  longDescription?: string | null;
  websiteUrl?: string | null;
  videoSrc?: string | null;
  isFeatured?: boolean;
  featuredOrder?: number | string | null;
};

function normalizeProjectPayload(body: ProjectInput, requireAll = true): ProjectRecord {
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
    isFeatured,
    featuredOrder,
  } = body;

  if (requireAll) {
    if (!title || !description || !category || !image) {
      throw new Error('Missing required fields: title, description, category, image');
    }
  }

  const normalizedTags = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

  const normalizedGallery = Array.isArray(gallery)
    ? gallery
    : typeof gallery === 'string'
      ? gallery.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

  return {
    title,
    description,
    category,
    tags: normalizedTags,
    image,
    mobile_image: mobileImage ?? null,
    gallery: normalizedGallery,
    metrics: metrics ?? null,
    long_description: longDescription ?? null,
    website_url: websiteUrl ?? null,
    video_src: videoSrc ?? null,
    is_featured: Boolean(isFeatured),
    featured_order: (() => {
      if (typeof featuredOrder === 'number') {
        return Number.isNaN(featuredOrder) ? null : featuredOrder;
      }
      if (typeof featuredOrder === 'string') {
        const trimmed = featuredOrder.trim();
        if (trimmed === '') return null;
        const parsed = Number(trimmed);
        return Number.isNaN(parsed) ? null : parsed;
      }
      return null;
    })(),
  };
}

export default router;
