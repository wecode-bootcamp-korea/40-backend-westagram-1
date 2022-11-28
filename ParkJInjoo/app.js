const http = require("http");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource } = require("typeorm");

app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

const database = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

database.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

app.post("/users", async (req, res) => {
  const { name, email, profile_image, password } = req.body;

  await database.query(
    `INSERT INTO users (
      name,
      email,
      profile_image,
      password
    ) VALUES (?, ?, ?, ?);
    `,
    [name, email, profile_image, password]
  );
  res.status(201).json({ message: "userCreated" });
});

app.post("/posts", async (req, res) => {
  const { title, posting_content, posting_image, user_id } = req.body;

  await database.query(
    `INSERT INTO posts(
      title,
      posting_content,
      posting_image,
      user_id
    ) VALUES (?,?,?,?);
    `,
    [title, posting_content, posting_image, user_id]
  );
  res.status(201).json({ message: "postCreated" });
});

app.get("/posts", async (req, res) => {
  await database.query(
    `SELECT
        p.id,
        p.posting_content,
        p.posting_image,
        p.user_id
    FROM posts p`,
    (err, rows) => {
      res.status(200).json(rows);
    }
  );
});

app.get("/posts/:userId", async (req, res) => {
  const { userId } = req.params;

  await database.query(
    `SELECT
        p.id,
        p.title,
        p.posting_content,
        p.posting_image,
        p.user_id
    FROM posts p 
    WHERE p.user_id = ${userId}
    `,
    (err, rows) => {
      res.status(200).json(rows);
    }
  );
});

app.patch("/posts", async (req, res) => {
  const { title, posting_content, posting_image, postId } = req.body;

  await database.query(
    `UPDATE posts 
    SET
      title = ?,
      posting_content = ?,
      posting_image = ?
    WHERE id = ? 
     `,
    [title, posting_content, posting_image, postId]
  );
  res.status(201).json({ message: "successfully updated" });
});

app.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  await database.manager.query(
    `DELETE FROM posts
    WHERE posts.id = ${postId}
    `
  );
  res.status(200).json({ message: "postingDeleted" });
});

app.post("/likes", async (req, res) => {
  const { user_id, post_id } = req.body;

  await database.query(
    `INSERT INTO likes (
      user_id,
      post_id
    ) VALUES (?,?);
    `,
    [user_id, post_id]
  );
  res.status(201).json({ message: "likeCreated" });
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
