const http = require('http');


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { DataSource } = require('typeorm')

const app = express();

const myDataSource = new DataSource({
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
        
        console.log("Failed to DataSource initialized")
    
    })

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/ping',(req, res, next) => {
    res.status(200).json({message : 'pong'});
});

app.get('/users/posts', async(req, res) => {
    await mysqlDataSource.query(
        `SELECT 
            u.id AS userId,
            u.profileImage AS userProfileImage,
            p.id AS postingId,
            p.ImageUrl AS postingImageUrl,
            p.content AS postingContent
          FROM users u, posts p
        `, (err, rows) => {
            res.status(200).json(rows);
    })
})

app.get('/posts/users', async(req, res) => {
    const { userId } = req.body

    await mysqlDataSource.query(
        `SELECT 
          u.id AS userId, 
          u.profileImage AS userProfileImage,
          p.id AS postings,
          p.ImageUrl AS postingImageUrl,
          p.content AS postingContent 
        FROM users u
        LEFT JOIN posts p 
        ON p.user_id = ${userId};`
        ,(err, rows) => {
            res.status(200).json(rows);
        })
})

app.get('/posts/lists', async(req, res) => {
    const { userId } = req.body
    
    await mysqlDataSource.query(
        `SELECT
          u.id AS userId,
          u.name AS userName,
          p.id AS postingId,
          p.title AS postingTitle,
          p.content AS postingContent
        FROM users u
        LEFT JOIN posts p
        ON p.id = ${userId};`
        , (err, rows) => {
            res.status(200).json(rows)
        }
    )
})

app.post('/users', async (req, res) => {
    const { userName, userEmail, userPassword, userImage } = req.body

    await mysqlDataSource.query(
        `INSERT INTO users (
            name,
            email,
            password,
            image
          ) VALUES (?, ?, ?, ?);
        `,
        [ userName, userEmail, userPassword, userImage ]
    )
    res.status(201).json({message: 'userCreated'})
})

app.post('/posts', async(req, res, next) => {
    const { title, content, userId } = req.body

    await mysqlDataSource.query(
        `INSERT INTO posts (
          title,
          content,
          user_id
        ) VALUES (?, ?, ?);
        `,
        [ title, content, userId ]
    )
    res.status(201).json({message : 'postCreated'})
})

const PORT = process.env.PORT;

const start = async() => {
    app.listen(PORT, () => console.log(`Server is listening to ${PORT}`));
    app.listen(PORT, () => console.log(`Server is listening to ${PORT}`));
}

start();