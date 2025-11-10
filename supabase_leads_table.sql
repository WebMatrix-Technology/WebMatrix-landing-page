-- Create leads table for contact form submissions
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  budget TEXT,
  timeline TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Add email validation constraint (optional, but recommended)
ALTER TABLE leads 
ADD CONSTRAINT check_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for public contact form)
CREATE POLICY "Allow public insert on leads"
ON leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Only authenticated users can read (for admin panel)
CREATE POLICY "Allow authenticated read on leads"
ON leads
FOR SELECT
TO authenticated
USING (true);

-- Policy: Only authenticated users can delete (for admin panel)
CREATE POLICY "Allow authenticated delete on leads"
ON leads
FOR DELETE
TO authenticated
USING (true);

-- Add comment to table
COMMENT ON TABLE leads IS 'Contact form submissions from the website';

-- Add comments to columns
COMMENT ON COLUMN leads.id IS 'Unique identifier for the lead';
COMMENT ON COLUMN leads.name IS 'Contact name';
COMMENT ON COLUMN leads.email IS 'Contact email address';
COMMENT ON COLUMN leads.budget IS 'Project budget (optional)';
COMMENT ON COLUMN leads.timeline IS 'Project timeline (optional)';
COMMENT ON COLUMN leads.message IS 'Project details message';
COMMENT ON COLUMN leads.created_at IS 'Timestamp when the lead was submitted';

