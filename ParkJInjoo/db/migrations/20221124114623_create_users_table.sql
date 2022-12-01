-- migrate:up
CREATE TABLE users (
<<<<<<< HEAD:ParkJInjoo/db/migrations/20221129065150_create_users_table.sql
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
=======
  id INT NOT NULL AUTO_INCREMENT,
>>>>>>> 1cbc1d8fff979e9fb03058b6b4c3ed6b5f01d32d:ParkJInjoo/db/migrations/20221124114623_create_users_table.sql
  name VARCHAR(50) NOT NULL,
  email VARCHAR(200) NOT NULL,
  profile_image VARCHAR(1000) NULL,
  password VARCHAR(200) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT users_email_ukey UNIQUE (email)
);

<<<<<<< HEAD:ParkJInjoo/db/migrations/20221129065150_create_users_table.sql

-- migrate:down
DROP TABLE users;
=======

-- migrate:down
DROP TABLE users;


>>>>>>> 1cbc1d8fff979e9fb03058b6b4c3ed6b5f01d32d:ParkJInjoo/db/migrations/20221124114623_create_users_table.sql
