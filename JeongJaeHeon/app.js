const http = require('http');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { DataSource } = require('typeorm')

const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        console.log("Failed to be initialized")
    })

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/ping',(req, res, next) => {
    res.status(200).json({message : 'pong'});
});

app.post('/users', async (req, res, next) => {
    const{ userName, userEmail, userPassword, profileImage } = req.body

    const SALT_ROUNDS=10;
    const hashedPassword = await bcrypt.hash(userPassword, SALT_ROUNDS)

    await mysqlDataSource.query(
        `INSERT INTO users (
            name, 
            email, 
            password, 
            profile_image
        ) VALUES (?, ?, ?, ?);
        `,
          [userName, userEmail, hashedPassword, profileImage]
    ) 
    res.status(201).json({ message : "userCreated"})
});

app.get('/login', async(req, res) => {
    const { userId, userPassword} = req.body

    const hashedPassword = 
        await mysqlDataSource.query(
            `SELECT u.password
                FROM users u WHERE u.id=?`, [userId]
        )
    const hash = hashedPassword[0].password

    const match = await bcrypt.compare(userPassword, hash)
            if(match === true) {
                const payLoad = { userId : userId }
                const secretKey = process.env.JWT_TOKEN_SECRET_KEY
                const jwtToken = jwt.sign(payLoad, secretKey, {algorithm:"HS256", expiresIn:"7d"})

                res.status(200).json({ accsessToken : jwtToken })
            } else {
                res.status(401).json({ message : "Invalid User" })
            }
})

const validateToken = async(req, res) => {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY)
    if(!true) {
        req.user = decoded
        next()
    } else {
        res.status(404).json({ message : "Invalid Access Token" })
    }
}

app.post('/posts', validateToken, async(req, res) => {
    const { userId } =req.user
    const { title, content, image_url } = req.body
    
    const posts = 
        await mysqlDataSource.query(
            `INSERT INTO posts (
                title,
                content,
                image_url
              ) VALUES (?, ?, ?)
            `, [ title, content, image_url ]    
        )
    res.status(201).json({ message : "postCreated" })
})

const PORT = process.env.PORT;

const start = async() => {
    app.listen(PORT, () => console.log(`Server is listening to ${PORT}`));
}

start();