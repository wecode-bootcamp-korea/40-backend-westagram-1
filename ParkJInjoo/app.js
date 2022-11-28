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

app.get("/ping", (req, res) => {
  res.json({ message: "pong!" });
});

app.post("/users", async (req, res) => {
  const { name, email, profile_image, password } = req.body;

  await myDataSource.query(
    `INSERT INTO users(
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

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
