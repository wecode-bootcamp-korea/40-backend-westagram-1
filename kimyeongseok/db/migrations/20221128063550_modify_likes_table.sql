-- migrate:up
alter table likes add unique(user_id,post_id)


-- migrate:down

