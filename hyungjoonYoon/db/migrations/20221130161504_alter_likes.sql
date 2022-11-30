-- migrate:up
ALTER TABLE likes 
MODIFY COLUMN id int AUTO_INCREMENT;

-- migrate:down

