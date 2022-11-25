-- migrate:up
ALTER TABLE posts ADD ImageUrl VARCHAR(1000) NOT NULL


-- migrate:down
DROP TABLE posts;
