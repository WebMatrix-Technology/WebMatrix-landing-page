# Vercel Deployment Guide

## Environment Variables Setup

After deploying to Vercel, you **must** configure the following environment variables in your Vercel project settings:

### Required Environment Variables

1. **Supabase Configuration**
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for backend API)
   - `VITE_SUPABASE_URL` - Same as SUPABASE_URL (for frontend)
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key (for frontend)

2. **Cloudinary Configuration** (for image uploads)
   - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

3. **Admin Configuration** (optional)
   - `VITE_ADMIN_ALLOWLIST` - Comma-separated list of admin email addresses

### How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable listed above
4. Make sure to add them for **Production**, **Preview**, and **Development** environments
5. Redeploy your application after adding the variables

### Getting Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `SUPABASE_URL` and `VITE_SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → Use for `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### Getting Your Cloudinary Credentials

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Navigate to **Settings** → **Security**
3. Copy:
   - **Cloud name** → Use for `CLOUDINARY_CLOUD_NAME`
   - **API Key** → Use for `CLOUDINARY_API_KEY`
   - **API Secret** → Use for `CLOUDINARY_API_SECRET`

## Important Notes

- **Never commit your `.env` file** - it's already in `.gitignore`
- The `VITE_` prefix is required for frontend environment variables in Vite
- After adding environment variables, you must **redeploy** for changes to take effect
- The API will automatically use relative paths in production (no need to set `VITE_API_URL`)

## Troubleshooting

### "Failed to fetch from database" Error

If you're seeing this error after deployment:

1. **Check environment variables** - Make sure all required variables are set in Vercel
2. **Verify Supabase credentials** - Ensure your Supabase URL and keys are correct
3. **Check Vercel function logs** - Go to Vercel Dashboard → Your Project → Functions tab to see error logs
4. **Redeploy** - After adding/changing environment variables, trigger a new deployment

### API Routes Not Working

- Ensure the `api/[...path].js` file exists (catch-all route handler)
- Check Vercel function logs for errors
- Verify that Express and all dependencies are in `package.json`

## Testing Locally

To test the API locally before deploying:

```bash
# Start the development server
npm run dev

# In another terminal, start the API server
npm run api
```

The frontend will be available at `http://localhost:8080` and the API at `http://localhost:4000`.

