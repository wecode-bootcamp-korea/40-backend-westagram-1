-- migrate:up
INSERT INTO posts (title, content, user_id, ImageUrl) VALUES ('sampleTitle2', 'sampleContent2', '2','imageUrlSample2'), ('sampleTitle3', 'sampleContent3', '3', 'imageUrlSample3'), ('sampleTitle4', 'sampleContent4', '4', 'imageUrlSample4');

-- migrate:down
DROP TABLE posts
