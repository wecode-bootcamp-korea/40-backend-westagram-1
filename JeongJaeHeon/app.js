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

myDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized")
    })
    .catch(() => {
        console.log("Data Source has not been initialized")
    })

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

app.get('/ping',(req, res, next) => {
    res.status(201).json({message : 'pong'});
});

app.post('/users/create', async (req, res, next) => {
    const { userName, userEmail, userPassword, userImage } = req.body

    await myDataSource.query(
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
    const { title, content } = req.body

    await myDataSource.query(
    `INSERT INTO posts (
        title,
        content
      ) VALUES (?, ?);
    `
    [ title, content ]
    )
    res.status(201).json({message : 'postCreated'})
})

const PORT = process.env.PORT;

const start = async() => {
    app.listen(PORT, () => console.log(`Server is listening to ${PORT}`));
}

start();