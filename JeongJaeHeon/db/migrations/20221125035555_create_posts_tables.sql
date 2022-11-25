-- migrate:up
UPDATE posts SET user_id="1" WHERE posts.user_id=2;
UPDATE posts SET user_id="1" WHERE posts.user_id=3;

-- migrate:down
DROP TABLE posts
