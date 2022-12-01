-- migrate:up
ALTER TABLE users ADD email VARCHAR(200) NOT NULL

-- migrate:down

