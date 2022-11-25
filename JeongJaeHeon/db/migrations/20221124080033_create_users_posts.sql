-- migrate:up
ALTER TABLE users_posts RENAME likes


-- migrate:down
DROP TABLE likes
