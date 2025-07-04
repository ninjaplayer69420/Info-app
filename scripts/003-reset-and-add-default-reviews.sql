-- Clear existing reviews and add default ones
DELETE FROM ratings WHERE product_id = 'video-editing-guide';

-- Add the 2 default 5-star reviews
INSERT INTO ratings (product_id, user_email, score, comment, created_at) 
VALUES 
  ('video-editing-guide', 'user1@example.com', 5, 'Amazing guide! Everything I needed to get started.', '2024-12-01 10:00:00+00'),
  ('video-editing-guide', 'user2@example.com', 5, 'Comprehensive and well-structured. Highly recommend!', '2024-12-10 14:30:00+00');

-- Update the product sales count
UPDATE products 
SET sales_count = 70 
WHERE id = 'video-editing-guide';
