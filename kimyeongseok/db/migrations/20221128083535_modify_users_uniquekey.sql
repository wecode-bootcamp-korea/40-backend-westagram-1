-- migrate:up
alter table users add unique(email)

-- migrate:down

