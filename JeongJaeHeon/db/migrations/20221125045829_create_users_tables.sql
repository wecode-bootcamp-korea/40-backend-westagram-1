-- migrate:up
UPDATE users SET name="wecode" WHERE users.id=1;

-- migrate:down
DROP TABLE users;
