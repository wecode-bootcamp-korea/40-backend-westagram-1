-- migrate:up
alter table users modify updated_at TIMESTAMP on update CURRENT_TIMESTAMP

-- migrate:down

