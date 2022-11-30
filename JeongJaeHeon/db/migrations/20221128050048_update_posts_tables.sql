-- migrate:up
ALTER TABLE posts MODIFY user_id INT NOT NULL UNIQUE

-- migrate:down
DROP TABLE posts;
