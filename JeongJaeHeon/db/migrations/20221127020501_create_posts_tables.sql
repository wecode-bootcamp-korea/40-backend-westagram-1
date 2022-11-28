-- migrate:up
ALTER TABLE posts ADD imageurl VARCHAR(1000) NOT NULL

-- migrate:down
DROP TABLE Posts;
