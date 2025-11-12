// Vercel catch-all route for /api/*
// This file handles all API routes: /api/projects, /api/posts, etc.
import type { Request, Response } from 'express';
import express from 'express';
import type { CorsOptions } from 'cors';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config as loadEnv } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');
loadEnv({ path: envPath });

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

// Import routers
import projectsRouter from './projects.js';
import postsRouter from './posts.js';
import uploadRouter from './upload.js';
import leadsRouter from './leads.js';
import dashboardRouter from './dashboard.js';

const app = express();

// CORS configuration
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

// API routes - paths will be like /projects, /posts, etc. (without /api prefix)
app.use('/projects', projectsRouter);
app.use('/posts', postsRouter);
app.use('/upload', uploadRouter);
app.use('/leads', leadsRouter);
app.use('/dashboard', dashboardRouter);

app.get('/', (_req, res) => {
  res.json({ 
    message: 'API is running',
    endpoints: ['/projects', '/posts', '/upload', '/leads', '/dashboard']
  });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: req.path,
    method: req.method
  });
});

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
    } else if (req.url) {
      // Fallback to req.url if query.path is not available
      path = req.url;
      // Strip /api prefix if present
      if (path.startsWith('/api')) {
        path = path.replace(/^\/api/, '') || '/';
      }
    }
    
    // Update req.url and req.path for Express
    const mutableReq = req as MutableRequest;
    mutableReq.url = path;
    mutableReq.path = path;
    mutableReq.originalUrl = req.originalUrl || path;
    
    console.log('[api] dispatching to express app with path', path);

    // Call Express app
    return new Promise((resolve, reject) => {
      app(req, res, (err) => {
        if (err) {
          console.error('[api] Express error:', err);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error', message: err.message });
          }
          reject(err);
        } else if (!res.headersSent) {
          res.status(404).json({ error: 'Not found', path: path });
        }
        resolve();
      });
    });
  } catch (error) {
    console.error('[api] Handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
    throw error;
  }
}

