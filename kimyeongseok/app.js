const http = require ("http");
const express = require ("express");
const cors = require ("cors");
const morgan = require ("morgan");

const dotenv = require ("dotenv");
dotenv.config()

const { DataSource } = require('typeorm');
const { json } = require("express");

const mysqlDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE  
})

mysqlDataSource.initialize()
 .then(() => {
    console.log("Data Source has been initialized")
 })

app = express()

app.use(express.json());
app.use(cors());
app.use(morgan('dev'))
 
app.get ("/ping", (req,res) => {
    res.status(200).json({ message : "pong"});
})

app.post("/users", async (req,res)=>{
  const { name, profile_image, password, email } = req.body

  await mysqlDataSource.query(
    `INSERT INTO users(
      name,
      profile_image,
      password,
      email
    ) VALUES (?, ?, ?, ?);
  `, [name, profile_image, password,email]
  );
  res.status(201).json({message:"userCreated"});
});

app.post("/posts", async (req,res)=>{
  const { title, user_id, content, image_url } = req.body

  await mysqlDataSource.query(
    `INSERT INTO posts(
      title,
      user_id,
      content,
      image_url
    )VALUE (?, ?, ?, ?);
    `, [title, user_id, content,image_url]
  );
  res.status(201).json({message:"postCreated"})
});

app.get("/posts", async (req,res)=>{
  await mysqlDataSource.query(
    `SELECT
     u.id as userId,
     u.profile_image as userProfileImage,
     p.id as PostingId,
     p.image_url as PostingImageUrl,
     p.content as PostingContent
     FROM posts p, users u
     WHERE p.user_id = u.id`
    ,(err,rows) => {
      res.status(200).json(rows);
    })
});
app.get("/userspost/:userId", async (req,res)=>{
  const userId = req.params.userId;
  await mysqlDataSource.query(
    `SELECT
    u.id as userId,
    u.profile_image as userProfileImage,
    JSON_ARRAYAGG(JSON_OBJECT("postingID",p.id,"postingContent",p.content,"postingImageurl",p.image_url)) as posting
    FROM posts p
    INNER JOIN users u
    ON u.id=${userId}
    GROUP BY u.id`
    ,(err,rows) => {
      res.status(200).json(rows)
    }
  )
})
app.patch("/updateinfo/:postId", async (req,res)=>{
  const postId = req.params.postId;
  const { title, content, image_url} = req.body
 await mysqlDataSource.query(
  `UPDATE posts
  SET
   title = ?,
   content = ?,
   image_url = ?
   WHERE id = ${postId}`,
   [ title, content, image_url]);
 const post =await myDataSource.query(
  `SELECT
   u.id as userId,
   u.name as UserName,
   p.id as postingId,
   p.title as postingTitle,
   p.content as postingContent
   FROM posts p INNER JOIN users u ON u.id =p.user_id WHERE p.id LIKE ${postId}
   ` );
 res.status(200).json({data: post[0]});
});

app.delete("/deletepost/:postId", async(req,res)=>{
  const postId = req.params.postId;
  await mysqlDataSource.query(
    `DELETE FROM posts
    WHERE posts.id = ${postId}
    `);
    res.status(200).json({message:"postingDeleted"});
});

app.post("/likes",async (req,res)=>{
 const { user_id , post_id} = req.body
  await mysqlDataSource.query (
    `INSERT INTO likes(
    post_id,
    user_id
    ) VALUE (?,?);
    ` , [ user_id, post_id]
  );
  res.status(200).json({message: "likeCreated"})
})

const server = http.createServer(app)
const PORT = process.env.PORT;
 
const start = async () => {
 server.listen(PORT, () => console.log( `server is listening on ${PORT}`))
}

start()