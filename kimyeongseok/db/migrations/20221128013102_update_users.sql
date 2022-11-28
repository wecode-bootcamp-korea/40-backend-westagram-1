-- migrate:up
ALTER TABLE users ADD email VARCHAR(1000) NOT NULL

-- migrate:down

