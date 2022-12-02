-- migrate:up
ALTER TABLE posts ADD user_id INT NOT NULL

-- migrate:down
DROP TABLE Posts;