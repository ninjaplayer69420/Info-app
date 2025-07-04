-- Create email subscribers table
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  product_id TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  substack_synced BOOLEAN DEFAULT FALSE,
  sync_attempts INTEGER DEFAULT 0,
  last_sync_attempt TIMESTAMP WITH TIME ZONE,
  sync_error TEXT,
  source TEXT DEFAULT 'product_download'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_synced ON email_subscribers(substack_synced);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_product ON email_subscribers(product_id);

-- Insert any existing emails from localStorage simulation
INSERT INTO email_subscribers (email, product_id, source) 
VALUES 
  ('demo@example.com', 'video-editing-guide', 'demo_data')
ON CONFLICT (email) DO NOTHING;
