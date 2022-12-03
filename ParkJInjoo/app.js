require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource } = require("typeorm");

const bcrypt = require("bcrypt");

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
  console.log("Data Source has been initialized!!");
});

const makeHash = async (password, saltRounds) => {
  return await bcrypt.hash(password, saltRounds);
};

//유저의 회원가입 bcrypt와 함께!!!
app.post("/users", async (req, res) => {
  const { name, email, profileImage, password } = req.body;
  const hashedPassword = await makeHash(password, 12);

  await database.query(
    `INSERT INTO users (
      name,
      email,
      profile_image,
      password
    ) VALUES (?, ?, ?, ?);
    `,
    [name, email, profileImage, hashedPassword]
  );
  res.status(201).json({ message: "userCreated" });
});

app.post("/posts", async (req, res) => {
  const { title, postingContent, postingImage, userId } = req.body;

  await database.query(
    `INSERT INTO posts(
      title,
      posting_content,
      posting_image,
      user_id
    ) VALUES (?,?,?,?);
    `,
    [(title, postingContent, postingImage, userId)]
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
  const userId = req.params.userId;

  const userPost = await database.query(
    `SELECT 
      u.id as userId,
      u.profile_image as userProfileImage, 
      JSON_ARRAYAGG(
        JSON_OBJECT(
          "postingID", p.id,
          "postingContent", p.posting_content,
          "postingImageUrl", p.posting_image
        )
      ) as posting
    FROM posts p
    INNER JOIN users u ON u.id=?
    GROUP BY u.id`,
    [userId]
  );
  res.status(200).json(userPost);
});

app.patch("/posts", async (req, res) => {
  const { title, postingContent, postingImage, postId } = req.body;

  await database.query(
    `UPDATE posts 
    SET
      title = ?,
      posting_content = ?,
      posting_image = ?
    WHERE id = ? 
     `,
    [title, postingContent, postingImage, postId]
  );
  res.status(201).json({ message: "successfully updated" });
});

app.delete("/posts/:postId", async (req, res) => {
  const postId = req.params.postId;

  await database.manager.query(
    `DELETE FROM posts
      WHERE posts.id = ?`,
    [postId]
  );
  res.status(200).json({ message: "postingDeleted" });
});

app.post("/likes", async (req, res) => {
  const { userId, postId } = req.body;

  await database.query(
    `INSERT INTO likes (
      user_id,
      post_id
    ) VALUES (?,?);
    `,
    [userId, postId]
  );
  res.status(201).json({ message: "likeCreated" });
});

const PORT = process.env.PORT;

const start = async () => {
  app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
