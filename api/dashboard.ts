import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { Router } from 'express';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { ensureSupabase, authenticate as authenticateRequest, type AuthResult } from './_lib/supabase.js';

const router = Router();

// Authentication middleware
const authenticate: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const result: AuthResult = await authenticateRequest(req);
  if ('error' in result) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.locals.user = result.user;
  next();
};

router.use(authenticate);

router.get('/', async (_req: Request, res: Response) => {
  const client: SupabaseClient | null = ensureSupabase(res);
  if (!client) return;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() - 1);

    // Get projects count
    const { count: projectsCount, error: projectsError } = await client
      .from('projects')
      .select('*', { count: 'exact', head: true });

    const { count: projectsToday, error: projectsTodayError } = await client
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Get posts count
    const { count: postsCount, error: postsError } = await client
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });

    const { count: postsToday, error: postsTodayError } = await client
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Get leads count
    const { count: leadsCount, error: leadsError } = await client
      .from('leads')
      .select('*', { count: 'exact', head: true });

    const { count: leadsToday, error: leadsTodayError } = await client
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    const { count: leadsThisWeek, error: leadsWeekError } = await client
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thisWeek.toISOString());

    // Get recent projects (last 5)
    const { data: recentProjects, error: recentProjectsError } = await client
      .from('projects')
      .select('id, title, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent posts (last 5)
    const { data: recentPosts, error: recentPostsError } = await client
      .from('blog_posts')
      .select('id, title, created_at, published_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent leads (last 5)
    const { data: recentLeads, error: recentLeadsError } = await client
      .from('leads')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Handle errors gracefully - if table doesn't exist, return 0
    const getCount = (count: number | null, error: PostgrestError | null, defaultValue = 0) => {
      if (error) {
        // If table doesn't exist, return default value
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return defaultValue;
        }
        // For other errors, still return default to prevent breaking
        console.warn('[api/dashboard] Count error:', error.message);
        return defaultValue;
      }
      return count ?? defaultValue;
    };

    const stats = {
      projects: {
        total: getCount(projectsCount, projectsError),
        today: getCount(projectsToday, projectsTodayError),
      },
      posts: {
        total: getCount(postsCount, postsError),
        today: getCount(postsToday, postsTodayError),
      },
      leads: {
        total: getCount(leadsCount, leadsError),
        today: getCount(leadsToday, leadsTodayError),
        thisWeek: getCount(leadsThisWeek, leadsWeekError),
      },
      recent: {
        projects: recentProjectsError ? [] : (recentProjects || []),
        posts: recentPostsError ? [] : (recentPosts || []),
        leads: recentLeadsError ? [] : (recentLeads || []),
      },
    };

    res.json(stats);
  } catch (err) {
    console.error('[api/dashboard] Unexpected error:', err);
    res.status(500).json({ 
      error: err instanceof Error ? err.message : 'Internal server error',
      // Return empty stats on error
      projects: { total: 0, today: 0 },
      posts: { total: 0, today: 0 },
      leads: { total: 0, today: 0, thisWeek: 0 },
      recent: { projects: [], posts: [], leads: [] },
    });
  }
});

export default router;

