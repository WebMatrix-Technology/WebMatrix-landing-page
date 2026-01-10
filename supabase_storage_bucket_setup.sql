-- Supabase Storage Bucket Setup Script
-- Run this in your Supabase SQL Editor after creating the bucket

-- Step 1: Create the bucket (do this via Dashboard first, then run policies below)
-- Go to Storage > New Bucket > Name: "project-images" > Public: true > Create

-- Step 2: Set up RLS Policies for the bucket

-- Policy 1: Allow authenticated users to upload (INSERT)
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-images'::text
);

-- Policy 2: Allow public read access (SELECT)
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'project-images'::text
);

-- Policy 3: Allow authenticated users to update their own files (UPDATE)
CREATE POLICY "Allow authenticated updates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-images'::text
)
WITH CHECK (
  bucket_id = 'project-images'::text
);

-- Policy 4: Allow authenticated users to delete (DELETE)
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-images'::text
);

-- Note: If you get "policy already exists" errors, you can drop and recreate:
-- DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
-- DROP POLICY IF EXISTS "Public read access" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

