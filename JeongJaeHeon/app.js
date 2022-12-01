const http = require('http');


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { DataSource } = require('typeorm')

const app = express();

const mysqlDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
})

mysqlDataSource.initialize()
    .then(() => {
        
        console.log("Data Source has been initialized")
    
    })
    .catch(() => {
        
        console.log("Failed to initialize Data source")
    
    })

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/ping',(req, res, next) => {
    res.status(200).json({message : 'pong'});
});

app.get('/posts/:userId', async(req, res) => {
    const { userId } = req.params;

    const posts = await mysqlDataSource.query(
        `SELECT 
            u.id AS userId,
            u.profile_image AS userProfileImage,
            p.id AS postingId,
            p.image_url AS postingImageUrl,
            p.content AS postingContent
          FROM posts p
          JOIN users u ON p.user_id = u.id
          WHERE p.user_id = ?
        `, [ userId ])
        res.status(200).json(posts);
    })

app.get('/posts', async(req, res) => {

    const posts = await mysqlDataSource.query(
        `SELECT
          u.id AS userId,
          u.name AS userName,
          p.id AS postingId,
          p.title AS postingTitle,
          p.content AS postingContent
        FROM posts p
        JOIN uses u ON p.user_id = u.id;
        `) 
        res.status(200).json(posts)
    })
    
app.post('/likes', async(req, res) => {
    const { userId, postId } = req.body

    await mysqlDataSource.query(
        `UPDATE likes
          SET 
            user_id = ?, 
            post_id = ? 
          `, [ userId, postId ])
    res.status(200).json({message : "likes Created"})
})

app.post('/users', async (req, res) => {
    const { userName, userEmail, userPassword, userImage } = req.body

    await mysqlDataSource.query(
        `INSERT INTO users (
            name,
            email,
            password,
            profile_image
          ) VALUES (?, ?, ?, ?);
        `,
        [ userName, userEmail, userPassword, userImage ]
    )
    res.status(201).json({message: 'userCreated'})
})

app.post('/posts', async(req, res, next) => {
    const { title, content, imageUrl, userId } = req.body

    await mysqlDataSource.query(
        `INSERT INTO posts (
          title,
          content,
          imageurl,
          user_id
        ) VALUES (?, ?, ?, ?);
        `,
        [ title, content, imageUrl, userId ]);

    res.status(201).json({message : 'postCreated'})
})

app.patch('/posts/:postId', async(req, res) => {
    const { postId } = req.params
    const { userId, title, content } = req.body
    
    await mysqlDataSource.query(
        `UPDATE 
            posts p
          SET  
            p.title= ?, p.content= ?
        WHERE p.id =?
        ` [ title, content, postId ]);

    const post = await mysqlDataSource.query(
        `SELECT
            u.id AS userId,
            u.profileimage AS userProfileImage,
            p.id AS postingId,
            p.title As postingTitle,
            p.content AS postingContent
          FROM posts p
          JOIN users u ON p.user_id = u.id
          WHERE p.user_id= ?;
        `, [ userId ])
        res.status(200).json({post})   
})

app.delete('/posts/:postId', async(req, res) => {
    const { postId } = req.params

    await mysqlDataSource.query(
        `DELETE FROM posts p
        WHERE p.id = ?
        `, [ postId ]
    )
    res.status(204).json({message : 'posting Deleted'})
})

const PORT = process.env.PORT;

const start = async() => {
    app.listen(PORT, () => console.log(`Server is listening to ${PORT}`));
}

start();