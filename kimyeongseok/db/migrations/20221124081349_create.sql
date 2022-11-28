-- migrate:up
ALTER TABLE posts ADD content VARCHAR(3000) NOT NULL

-- migrate:down

