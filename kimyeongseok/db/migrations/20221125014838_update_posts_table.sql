-- migrate:up
ALTER TABLE posts ADD image_url VARCHAR(3000) NULL

-- migrate:down

