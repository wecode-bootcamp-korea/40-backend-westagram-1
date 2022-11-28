-- migrate:up
CREATE TABLE posts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
  title VARCHAR(100) NOT NULL,
  posting_content VARCHAR(3000) NOT NULL,
  posting_image VARCHAR(1000) NOT NULL,
  user_id INT NOT NULL,
  CONSTRAINT posts_user_id_fkey FOREIGN KEY(user_id) REFERENCES users(id)
);


-- migrate:down
DROP TABLE posts;
