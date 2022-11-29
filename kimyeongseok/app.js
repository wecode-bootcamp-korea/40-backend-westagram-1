const http = require ("http");

require ("dotenv").config();
const express = require ("express");
const cors = require ("cors");
const morgan = require ("morgan");
const { DataSource } = require('typeorm');

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
  const { name, profileImage , password, email } = req.body

  await mysqlDataSource.query(
    `INSERT INTO users(
      name,
      profile_image,
      password,
      email
    ) VALUES (?, ?, ?, ?);`, 
    [name, profileImage, password, email]
  );
  res.status(200).json({message:"userCreated"});
});

app.post("/posts", async (req,res)=>{
  const { title, userId, content, imageUrl } = req.body

  await mysqlDataSource.query(
    `INSERT INTO posts(
      title,
      user_id,
      content,
      image_url
    )VALUE (?, ?, ?, ?);`, 
    [title, userId, content,imageUrl]
  );
  res.status(200).json({message:"postCreated"})
});

app.get("/posts", async (req,res)=>{
  await mysqlDataSource.query(
    `SELECT
      u.id as userId,
      u.profile_image as userProfileImage,
      p.id as PostingId,
      p.image_url as PostingImageUrl,
      p.content as PostingContent
      FROM posts p
      JOIN users u ON p.user_id = u.id`
      ,(err,rows) => {
      res.status(200).json(rows);
    }
  )
});

app.get("/usersPost/:userId", async (req,res)=>{
  const userId = req.params.userId;
  const userPost =  await mysqlDataSource.query(
    `SELECT
      u.id as userId,
      u.profile_image as userProfileImage,
      JSON_ARRAYAGG(
       JSON_OBJECT(
        "postingID",p.id, 
        "postingContent",p.content, 
        "postingImageurl",p.image_url
         )
        ) as posting
      FROM posts p
      INNER JOIN users u ON u.id= ?
      GROUP BY u.id`,
       [userId]);
        res.status(200).json(userPost)
})
app.patch("/updateInfo/:postId", async (req,res)=>{
  const postId = req.params.postId;
  const { title, content, imageUrl} = req.body
 await mysqlDataSource.query(
  `UPDATE posts
   SET
   title = ?,
   content = ?,
   image_url = ?
   WHERE id = ?`,
   [ title, content, imageUrl,postId]);
 const post =await mysqlDataSource.query(
  `SELECT
    u.id as userId,
    u.name as UserName,
    p.id as postingId,
    p.title as postingTitle,
    p.content as postingContent
    FROM posts p 
    INNER JOIN users u ON u.id =p.user_id 
    WHERE p.user_id =?` 
    ,[postId]);
 res.status(200).json({data: post[0]});
});

app.delete("/deletePost/:postId", async(req,res)=>{
  const postId = req.params.postId;
  await mysqlDataSource.query(
    `DELETE FROM posts
      WHERE posts.id = ?`
     ,[postId]);
    res.status(200).json({message:"postingDeleted"});
});

app.post("/likes",async (req,res)=>{
 const { userId , postId} = req.body
  await mysqlDataSource.query (
    `INSERT INTO likes(
    post_id,
    user_id
    ) 
    VALUE (?,?);` , 
     [ userId, postId]
  );
  res.status(200).json({message: "likeCreated"})
})

const server = http.createServer(app)
const PORT = process.env.PORT;
 
const start = async () => {
 server.listen(PORT, () => console.log( `server is listening on ${PORT}`))
}

start()