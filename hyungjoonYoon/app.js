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

app.post("/signUp", async (req, res, next) => {
  const { name, email, profile_image, password } = req.body;

  await appDataSource.query(
    `INSERT INTO users(
      name,
      email,
      profile_image,
      password
    ) 
    VALUES (?,?,?,?);
    `,
    [name, email, profile_image, password]
  );
  res.status(201).json({ message: "userCreated" });
});

app.post("/post", async (req, res, next) => {
  const { title, content, user_id } = req.body;

  await appDataSource.query(
    `INSERT INTO posts(
      title,
      content,
      user_id
    ) 
    VALUES (?,?,?);
    `,
    [title, content, user_id]
  );
  res.status(201).json({ message: "postCreated" });
});

app.get("/lookUpPosts", async (req, res) => {
  await appDataSource.query(`SELECT * FROM posts`, (err, rows) => {
    res.status(200).json({ data: rows });
  });
});

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};

start();
