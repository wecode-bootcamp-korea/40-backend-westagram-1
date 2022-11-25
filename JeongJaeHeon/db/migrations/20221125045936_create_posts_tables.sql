-- migrate:up
UPDATE posts SET title='간단한 HTTP API 개발 시작!', content='기존과 다르게 수정한 내용입니다.' WHERE posts.id=1;

-- migrate:down

