import { config as loadEnv } from 'dotenv';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '.env');
loadEnv({ path: envPath });
console.log('[api] loading env from', envPath);
console.log('[api] SUPABASE_URL present:', !!process.env.SUPABASE_URL);
console.log('[api] SERVICE ROLE present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const { default: projectsRouter } = await import('./api/projects.js');
const { default: postsRouter } = await import('./api/posts.js');
const { default: uploadRouter } = await import('./api/upload.js');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS - allow all origins in development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow all localhost origins
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    callback(null, true); // Allow all for now in dev
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));

app.use('/api/projects', projectsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/upload', uploadRouter);

app.get('/', (_req, res) => {
  res.json({ 
    message: 'API is running',
    endpoints: ['/api/projects', '/api/posts', '/api/upload']
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

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Available endpoints: /api/projects, /api/posts, /api/upload`);
});
