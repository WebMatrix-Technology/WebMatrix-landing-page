import { config as loadEnv } from 'dotenv';
import express, { type Request, type Response } from 'express';
import cors, { type CorsOptions } from 'cors';
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
const { default: leadsRouter } = await import('./api/leads.js');

let dashboardRouter: express.Router;
try {
  const dashboardModule = await import('./api/dashboard.js');
  dashboardRouter = dashboardModule.default;
  console.log('[api] Dashboard router loaded successfully');
} catch (err) {
  console.error('[api] Failed to load dashboard router:', err);
  dashboardRouter = express.Router();
  dashboardRouter.get('/', (_req: Request, res: Response) => {
    res.status(500).json({ error: 'Dashboard router failed to load' });
  });
}

const app = express();
const PORT = Number(process.env.PORT) || 4000;

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
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

app.use('/api/projects', projectsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/api', (_req: Request, res: Response) => {
  res.json({
    message: 'Local API running',
    endpoints: ['/api/projects', '/api/posts', '/api/upload', '/api/leads', '/api/dashboard']
  });
});

app.listen(PORT, () => {
  console.log(`[api] server listening on http://localhost:${PORT}`);
});


