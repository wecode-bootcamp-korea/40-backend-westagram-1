-- migrate:up
ALTER TABLE users ADD CONSTRAINT users_email_ukey 

-- migrate:down
DROP TABLE users;
