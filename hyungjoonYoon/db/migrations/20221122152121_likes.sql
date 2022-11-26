-- migrate:up
CREATE TABLE likes (
  id INT NOT NULL, 
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  CONSTRAINT user_post_combination_ukey UNIQUE (user_id, post_id),
  PRIMARY KEY(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- migrate:down
DROP TABLE likes;
