-- migrate:up
ALTER TABLE users MODIFY updated_at TIMESTAMP
-- migrate:down
DROP TABLE users;
