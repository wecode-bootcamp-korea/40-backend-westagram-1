const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource } = require("typeorm");

dotenv.config();

const appDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

appDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch(() => {
    console.log("Error: Data Source initialization has been failed");
  });

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

app.post("/signUp", async (req, res) => {
  const { name, email, profileImage, password } = req.body;

  await appDataSource.query(
    `
    INSERT INTO users(
      name,
      email,
      profile_image,
      password
    ) VALUES (?,?,?,?);
    `,
    [name, email, profileImage, password]
  );
  res.status(201).json({ message: "userCreated" });
});

app.post("/post", async (req, res) => {
  const { title, content, userId } = req.body;
  await appDataSource.query(
    `
    INSERT INTO posts(
      title,
      content,
      user_id
    ) VALUES (?,?,?);
    `,
    [title, content, userId]
  );
  res.status(201).json({ message: "postCreated" });
});

app.get("/lookUpPosts", async (req, res) => {
  await appDataSource.query(
    `
    SELECT 
      u.id AS userId, 
      u.profile_image AS userProfileImage,
      p.id AS postingId,
      p.postingImageUrl AS postingImageUrl,
      p.content AS postingContent
    FROM posts p
    INNER JOIN users AS u ON u.id = p.user_id;
    `,
    (err, rows) => {
      res.status(200).json({ data: rows });
    }
  );
});

app.get("/lookUpPostsByUser/:inputId", async (req, res) => {
  const userId = req.params.inputId;
  const user = await appDataSource.manager.query(
    `
    SELECT 
      id AS userId,
      profile_image AS userProfileImage
    FROM users
    WHERE users.id = ${userId};
    `
  );
  const userpost = await appDataSource.manager.query(
    `
    SELECT
      id as postingId,
      title as postingImageUrl,
      content as postingContent
    FROM posts
    WHERE user_id = ${userId};`
  );
  user[0].postings = userpost;
  res.status(200).json({ data: user[0] });
});

app.patch("/updatePost/:user_id/:posting_id", async (req, res) => {
  const userId = Number(req.params.user_id);
  const postingId = Number(req.params.posting_id);

  const { content } = req.body;

  await appDataSource.query(
    `
    UPDATE posts
		  SET 
		  content = ?
		  WHERE id = ?;
		`,
    [content, postingId]
  );

  const updated = await appDataSource.manager.query(
    `
    SELECT 
      u.id AS userId,
      u.name AS userName, 
      p.id AS postingId, 
      p.title AS postingTitle, 
      p.content AS postingContent
    FROM posts AS p
    INNER JOIN users AS u ON u.id = p.user_id
    WHERE u.id = ${userId} AND p.id = ${postingId};
    `
  );
  res.status(201).json({ data: updated[0] });
});

app.delete("/deletePost/:postingId", async (req, res) => {
  const postingId = Number(req.params.postingId);
  await appDataSource.manager.query(
    `DELETE FROM posts WHERE id = ${postingId}`
  );
  res.status(201).json({ message: "postingDeleted" });
});

app.post("/likeAPost", async (req, res) => {
  const { postingId, userId } = req.body;
  await appDataSource.manager.query(
    `
    INSERT INTO likes (user_id, post_id)
    VALUES (?,?);
    `,
    [userId, postingId]
  );
  res.status(201).json({ message: "likeCreated" });
});

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

start();
