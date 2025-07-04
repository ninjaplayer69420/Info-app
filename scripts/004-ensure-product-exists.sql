-- Make sure the video editing guide product exists in the database
INSERT INTO products (id, title, description, long_description, image, price, download_url, sales_count) 
VALUES (
  'video-editing-guide',
  'Ultimate Guide to Video Editing',
  'From Beginner to Getting Clients. Ultimate Video Editing Course.',
  'From Beginner to Getting Clients. Ultimate Video Editing Course.

This comprehensive video editing bundle contains everything you need to master video editing and start getting clients.

What''s included:

CHAPTER 1: Full Capcut Guide
Complete guide to mastering Capcut for mobile and desktop video editing.

CHAPTER 2: 1000+ Presets Pack
Massive collection of professional presets to enhance your videos instantly.

CHAPTER 3: 20+ Effects Tutorials
Step-by-step tutorials for creating stunning visual effects.

CHAPTER 4: Full Premiere Pro Guide
Complete Adobe Premiere Pro course from beginner to advanced.

CHAPTER 5: 50GB+ Editing Pack
Huge collection of editing assets, templates, and resources.

CHAPTER 6: 5 Ways To Get Clients
Proven strategies to find and secure video editing clients.

CHAPTER 7: TOP 50 AI Tools (Ranked)
Comprehensive list of the best AI tools for video creators.

CHAPTER 8: Movie Clips & Memes
Collection of popular clips and meme templates for content creation.

CHAPTER 9: Sound Design
Professional sound design techniques and audio resources.',
  '/video-editing-banner.webp',
  0,
  '/downloads/video-editing-guide.pdf',
  70
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  image = EXCLUDED.image,
  price = EXCLUDED.price,
  download_url = EXCLUDED.download_url,
  sales_count = EXCLUDED.sales_count;

-- Clear existing default reviews and add fresh ones
DELETE FROM ratings WHERE product_id = 'video-editing-guide' AND user_email IN ('user1@example.com', 'user2@example.com');

-- Add the 2 default 5-star reviews
INSERT INTO ratings (product_id, user_email, score, comment, created_at) 
VALUES 
  ('video-editing-guide', 'user1@example.com', 5, 'Amazing guide! Everything I needed to get started.', '2024-12-01 10:00:00+00'),
  ('video-editing-guide', 'user2@example.com', 5, 'Comprehensive and well-structured. Highly recommend!', '2024-12-10 14:30:00+00')
ON CONFLICT (product_id, user_email) DO UPDATE SET
  score = EXCLUDED.score,
  comment = EXCLUDED.comment,
  created_at = EXCLUDED.created_at;
