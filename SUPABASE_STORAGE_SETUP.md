# Supabase Storage Setup Guide

This guide explains how to set up Supabase Storage to store project images instead of base64-encoded strings in the database.

## Benefits

- **Reduced Database Size**: Images stored separately, not in database rows
- **Better Performance**: Faster queries, smaller database
- **Scalability**: Can handle large images and many uploads
- **Public URLs**: Images accessible via direct URLs

## Setup Steps

### 1. Create a Storage Bucket

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Configure the bucket:
   - **Name**: `project-images` (or any name you prefer)
   - **Public bucket**: ✅ **Check this** (images need to be publicly accessible)
   - **File size limit**: Set to 10MB or your preferred limit
   - **Allowed MIME types**: `image/*` (or leave empty to allow all)
6. Click **"Create bucket"**

### 2. Set Bucket Policies (RLS Policies)

Your bucket needs policies to allow authenticated users to upload files. Go to **Storage** → **Policies** → Select your bucket → **"New Policy"**.

#### Policy 1: Allow Authenticated Users to Upload

```sql
-- Policy name: "Allow authenticated uploads"
-- Policy type: INSERT

(
  bucket_id = 'project-images'::text
  AND auth.role() = 'authenticated'::text
)
```

#### Policy 2: Allow Public Read Access

```sql
-- Policy name: "Public read access"
-- Policy type: SELECT

(bucket_id = 'project-images'::text)
```

#### Policy 3: Allow Authenticated Users to Delete

```sql
-- Policy name: "Allow authenticated deletes"
-- Policy type: DELETE

(
  bucket_id = 'project-images'::text
  AND auth.role() = 'authenticated'::text
)
```

Alternatively, you can use the Supabase Dashboard UI:
- Go to **Storage** → **Policies** → Click on your bucket
- Click **"New Policy"** → **"For full customization"**
- Copy and paste each policy above

### 3. Configure Environment Variables

#### Backend Environment Variables

Add to your backend `.env` file or environment:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=project-images
```

**Note**: The bucket name defaults to `project-images` if `SUPABASE_STORAGE_BUCKET` is not set.

#### Frontend Environment Variables

The frontend uses the same Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Install Dependencies

Make sure you have the required packages installed:

**Backend:**
```bash
cd WebMatrix-Backend
npm install uuid @types/uuid
```

**Frontend:**
Already included in the Next.js app - no additional packages needed.

### 5. Test the Upload Flow

1. Start your backend server:
   ```bash
   cd WebMatrix-Backend
   npm run dev
   ```

2. Start your frontend server:
   ```bash
   cd WebMatrix-landing-page
   npm run dev
   ```

3. Go to the admin panel and try uploading an image:
   - Navigate to `/admin/projects`
   - Create or edit a project
   - Use the image dropzone to upload an image
   - The image should upload to Supabase Storage
   - Check your Storage bucket in Supabase Dashboard to confirm the file appears

## How It Works

1. **Upload Flow**:
   - User selects an image via the `ImageDropzone` component
   - Component creates a base64 preview for immediate feedback
   - Component uploads the file to `/api/upload` endpoint
   - Backend receives the file and uploads it to Supabase Storage bucket
   - Backend returns the public URL of the uploaded file
   - The URL is stored in the database (instead of base64 string)

2. **Fallback Behavior**:
   - If upload fails or no authentication token is available
   - The component falls back to storing the base64 data URL
   - This ensures the app still works even if Storage is not configured

3. **Database Storage**:
   - Images are stored as URLs (e.g., `https://project.supabase.co/storage/v1/object/public/project-images/uuid.jpg`)
   - Much smaller database size compared to base64 strings
   - Images load faster from CDN

## Troubleshooting

### "Upload failed" Error

- **Check bucket exists**: Verify the bucket name in Supabase Dashboard
- **Check bucket is public**: The bucket must be public for images to be accessible
- **Check RLS policies**: Ensure policies allow authenticated uploads
- **Check environment variables**: Verify `SUPABASE_STORAGE_BUCKET` is set correctly
- **Check service role key**: Ensure `SUPABASE_SERVICE_ROLE_KEY` is correct

### Images Not Displaying

- **Check bucket is public**: Public bucket is required for public URLs
- **Check CORS settings**: Supabase Storage should handle CORS automatically
- **Check URL format**: URLs should look like `https://project.supabase.co/storage/v1/object/public/bucket-name/file.jpg`

### Permission Denied Errors

- **Check RLS policies**: Ensure you've created the policies above
- **Check authentication**: User must be authenticated via Supabase Auth
- **Check service role key**: Backend uses service role key which bypasses RLS

## Migration from Base64 to URLs

If you have existing projects with base64 images:

1. Images already stored as base64 will continue to work
2. New uploads will use Supabase Storage URLs
3. You can optionally migrate existing images by:
   - Downloading the base64 data
   - Converting back to a file
   - Uploading to Supabase Storage
   - Updating the database with the new URL

## Additional Configuration

### Custom Bucket Name

If you want to use a different bucket name:

1. Update the bucket name in Supabase Dashboard
2. Set `SUPABASE_STORAGE_BUCKET` environment variable to your bucket name
3. Update policies to use your bucket name

### File Size Limits

- Default: 10MB (configured in multer middleware)
- To change: Update `limits.fileSize` in `backend/api/upload.ts`
- Also update the limit in your Supabase bucket settings

### File Types

Currently accepts any image type. To restrict:

- Update `accept="image/*"` in `dropzone.tsx` to specific types
- Update bucket MIME type restrictions in Supabase Dashboard


