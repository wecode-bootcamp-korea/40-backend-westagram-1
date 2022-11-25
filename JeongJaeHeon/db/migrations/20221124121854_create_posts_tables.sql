-- migrate:up
UPDATE posts SET title="sampleTitle1", content="sampleContent1", ImageUrl="imageUrlSample1" WHERE posts.id=1;

-- migrate:down
DROP TABLE posts
