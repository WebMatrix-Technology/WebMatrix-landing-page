-- Migration: Add featured project columns to projects table
-- Run this in your Supabase SQL Editor

-- Add is_featured column (boolean, default false)
-- This column marks projects that should appear in the "Latest Work" section
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE projects 
    ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
    
    COMMENT ON COLUMN projects.is_featured IS 'Whether this project should be featured in the Latest Work section on the home page';
  END IF;
END $$;

-- Add featured_order column (integer, nullable)
-- This column controls the display order of featured projects (lower numbers appear first)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'featured_order'
  ) THEN
    ALTER TABLE projects 
    ADD COLUMN featured_order INTEGER;
    
    COMMENT ON COLUMN projects.featured_order IS 'Display order for featured projects. Lower numbers appear first. NULL means no specific order.';
  END IF;
END $$;

-- Create index for faster queries when filtering featured projects
-- This index helps when querying: WHERE is_featured = true ORDER BY featured_order ASC, created_at DESC
CREATE INDEX IF NOT EXISTS idx_projects_featured 
ON projects(is_featured, featured_order NULLS LAST, created_at DESC)
WHERE is_featured = true;

-- Optional: Add a check constraint to ensure featured_order is positive when set
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_featured_order_positive'
  ) THEN
    ALTER TABLE projects 
    ADD CONSTRAINT check_featured_order_positive 
    CHECK (featured_order IS NULL OR featured_order > 0);
  END IF;
END $$;

-- Example: Mark some existing projects as featured (optional - adjust IDs as needed)
-- Uncomment and modify these lines if you want to set initial featured projects
/*
UPDATE projects 
SET is_featured = true, featured_order = 1 
WHERE id = 'your-project-id-1';

UPDATE projects 
SET is_featured = true, featured_order = 2 
WHERE id = 'your-project-id-2';

UPDATE projects 
SET is_featured = true, featured_order = 3 
WHERE id = 'your-project-id-3';
*/

