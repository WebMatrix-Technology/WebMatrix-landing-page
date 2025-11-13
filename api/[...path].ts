// Vercel catch-all route for /api/*
// This file handles all API routes: /api/projects, /api/posts, etc.
import type { Request, Response } from 'express';
import express from 'express';
import type { CorsOptions } from 'cors';
import cors from 'cors';

// Only load .env file in development (Vercel provides env vars directly)
// Note: Top-level await might not work in all serverless environments
// So we'll load it lazily if needed

const requiredEnvKeys = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
];

try {
  const envStatus = Object.fromEntries(
    requiredEnvKeys.map((key) => [key, process.env[key] ? 'set' : 'missing'])
  );
  console.log('[api] env status', envStatus);
} catch (envLogError) {
  console.warn('[api] failed to log env status', envLogError);
}

// External backend proxy mode
const BACKEND_URL = process.env.BACKEND_URL || process.env.VITE_BACKEND_URL || '';

// Optional minimal express (kept for potential middleware/CORS if needed later)
const app = express();
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));


// Vercel serverless function handler
// For catch-all routes, Vercel passes path segments as req.query.path (array)
type PathQuery = { path?: string | string[] };
type MutableRequest = Request & { path: string; url: string; originalUrl: string };

export default async function handler(
  req: Request<Record<string, unknown>, unknown, unknown, PathQuery>,
  res: Response
): Promise<void> {
  try {
    // Handle catch-all path parameter
    // Vercel provides path segments in req.query.path as an array
    // e.g., /api/projects/123 -> req.query.path = ['projects', '123']
    let path = '/';
    
    if (req.query && req.query.path) {
      // If path is an array, join it
      const pathArray = Array.isArray(req.query.path) 
        ? req.query.path 
        : [req.query.path];
      path = '/' + pathArray.join('/');
      console.log('[api] Path from query.path:', path, 'original query:', req.query);
    } else if (req.url) {
      // Fallback to req.url if query.path is not available
      path = req.url;
      console.log('[api] Path from req.url (before strip):', path);
      // Strip /api prefix if present
      if (path.startsWith('/api')) {
        path = path.replace(/^\/api/, '') || '/';
      }
      console.log('[api] Path from req.url (after strip):', path);
    }
    
    // Also check req.originalUrl
    if (req.originalUrl && !path.startsWith('/projects') && !path.startsWith('/posts')) {
      console.log('[api] Also checking req.originalUrl:', req.originalUrl);
    }
    
    // If external backend configured, proxy the request
    if (BACKEND_URL) {
      const originalUrl = req.originalUrl || req.url || path;
      const queryIndex = originalUrl.indexOf('?');
      const queryString = queryIndex >= 0 ? originalUrl.slice(queryIndex) : '';

      const targetBase = BACKEND_URL.replace(/\/$/, '');
      const targetUrl = `${targetBase}${path}${queryString}`;

      // Build headers (strip hop-by-hop)
      const forwardHeaders: Record<string, string> = {};
      for (const [key, value] of Object.entries(req.headers)) {
        if (!value) continue;
        const lower = key.toLowerCase();
        if (['host', 'connection', 'content-length'].includes(lower)) continue;
        forwardHeaders[key] = Array.isArray(value) ? value.join(',') : String(value);
      }

      let body: BodyInit | undefined = undefined;
      if (req.method && !['GET', 'HEAD'].includes(req.method.toUpperCase())) {
        // Prefer JSON; adjust if you add multipart endpoints
        if (req.is('application/json') && typeof req.body !== 'undefined') {
          body = JSON.stringify(req.body);
          forwardHeaders['Content-Type'] = 'application/json';
        } else if (typeof req.body === 'string') {
          body = req.body;
        } else {
          // As a fallback, re-stringify body if present
          try {
            body = JSON.stringify(req.body ?? {});
            forwardHeaders['Content-Type'] = 'application/json';
          } catch {
            body = undefined;
          }
        }
      }

      console.log('[api-proxy] ->', req.method, targetUrl);

      const backendResponse = await fetch(targetUrl, {
        method: req.method,
        headers: forwardHeaders,
        body,
      });

      // forward status and body
      const contentType = backendResponse.headers.get('content-type') || 'application/json';
      res.status(backendResponse.status);
      res.setHeader('content-type', contentType);

      if (contentType.includes('application/json')) {
        const data = await backendResponse.json().catch(() => ({}));
        res.json(data);
      } else {
        const text = await backendResponse.text();
        res.send(text);
      }
      return;
    }

    // If no external backend configured, show diagnostic
    res.status(500).json({
      error: 'Backend URL not configured',
      message: 'Set BACKEND_URL (or VITE_BACKEND_URL) environment variable to your external backend base URL.',
      path,
    });
  } catch (error) {
    console.error('[api] Handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    throw error;
  }
}

