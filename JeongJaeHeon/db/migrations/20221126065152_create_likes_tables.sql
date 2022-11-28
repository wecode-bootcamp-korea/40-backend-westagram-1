-- migrate:up
CREATE TABLE likes (
    id INT NOT NULL PRIMARY KEY,
    user_id INT NULL,
    post_id INT NULL,
    CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(id)
)

-- migrate:down
DROP TABLE likes;
