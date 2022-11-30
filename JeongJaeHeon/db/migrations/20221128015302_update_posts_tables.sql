-- migrate:up
ALTER TABLE posts ADD imageurl VARCHAR(2000) NOT NULL

-- migrate:down
DROP TABLE posts;
