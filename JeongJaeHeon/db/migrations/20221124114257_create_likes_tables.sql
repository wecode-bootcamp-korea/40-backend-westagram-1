-- migrate:up
ALTER TABLE likes ADD CONSTRAINT UC_like UNIQUE (user_id, post_id);

-- migrate:down
DROP TABLE posts;
