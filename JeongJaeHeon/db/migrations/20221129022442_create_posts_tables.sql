-- migrate:up
ALTER TABLE posts MODIFY imageurl image_url VARCHAR(1000) NOT NULL

-- migrate:down
DROP TABLE posts
