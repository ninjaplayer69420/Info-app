-- Insert sample product data
INSERT INTO products (id, title, description, long_description, image, price, download_url, sales_count) 
VALUES (
  'video-editing-guide',
  'Complete Video Editing Guide',
  'Master video editing with this comprehensive guide covering all the essential techniques and tools.',
  'This comprehensive video editing guide will take you from beginner to advanced level. Learn professional techniques used by industry experts, master popular editing software, and create stunning videos that captivate your audience.

What you''ll learn:
• Professional video editing workflows
• Color correction and grading techniques
• Audio editing and mixing
• Motion graphics and effects
• Export settings for different platforms
• Time-saving tips and shortcuts

Perfect for content creators, YouTubers, and anyone looking to improve their video editing skills.',
  '/placeholder.svg?height=400&width=600',
  0,
  '/downloads/video-editing-guide.pdf',
  247
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  image = EXCLUDED.image,
  price = EXCLUDED.price,
  download_url = EXCLUDED.download_url;

-- Insert sample ratings
INSERT INTO ratings (product_id, user_email, score, comment, created_at) 
VALUES 
  ('video-editing-guide', 'user1@example.com', 5, 'Excellent guide! Very comprehensive and easy to follow.', '2024-01-15 10:00:00+00'),
  ('video-editing-guide', 'user2@example.com', 4, 'Great content, helped me improve my editing skills significantly.', '2024-01-20 14:30:00+00')
ON CONFLICT (product_id, user_email) DO NOTHING;
