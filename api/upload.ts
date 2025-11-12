import type { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { Router } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer, { type FileFilterCallback } from 'multer';
import { ensureSupabase, authenticate as authenticateRequest, type AuthResult } from './_lib/supabase.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Auth middleware
const authenticate: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const result: AuthResult = await authenticateRequest(req);
  if ('error' in result) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.locals.user = result.user;
  next();
};

// Upload endpoint
router.post('/', authenticate, upload.single('image'), async (req: Request, res: Response) => {
  if (!ensureSupabase(res)) return;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Convert buffer to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'lumen-sphere',
      resource_type: 'auto',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload image';
    res.status(500).json({ 
      error: message 
    });
  }
});

export default router;

