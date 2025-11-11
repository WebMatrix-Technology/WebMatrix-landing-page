// Vercel catch-all route for /api/*
// This file handles all API routes: /api/projects, /api/posts, etc.
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config as loadEnv } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');
loadEnv({ path: envPath });

// Import routers
import projectsRouter from './projects.js';
import postsRouter from './posts.js';
import uploadRouter from './upload.js';
import leadsRouter from './leads.js';
import dashboardRouter from './dashboard.js';

const app = express();

// CORS configuration
const corsOptions = {
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
export default async function handler(req, res) {
  // Vercel passes the path in req.url, which will be like /api/projects
  // We need to strip /api prefix for Express routing
  const originalUrl = req.url;
  
  if (req.url.startsWith('/api')) {
    req.url = req.url.replace(/^\/api/, '') || '/';
  }
  
  // Call Express app
  return new Promise((resolve) => {
    app(req, res, () => {
      if (!res.headersSent) {
        res.status(404).json({ error: 'Not found', path: originalUrl });
      }
      resolve();
    });
  });
}

