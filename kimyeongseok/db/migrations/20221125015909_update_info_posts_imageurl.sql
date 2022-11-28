-- migrate:up
UPDATE posts SET image_url='imageUrlSample1' WHERE user_id=1 AND id=1,
UPDATE posts SET image_url='imageUrlSample2' WHERE user_id=2 AND id=2
 
-- migrate:down

