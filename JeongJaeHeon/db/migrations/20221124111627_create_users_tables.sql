-- migrate:up
ALTER TABLE users CHANGE image profileImage VARCHAR(1000) NULL

-- migrate:down
DROP TABLE users;
