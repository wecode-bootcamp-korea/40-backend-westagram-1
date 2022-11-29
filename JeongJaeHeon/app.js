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

    await mysqlDataSource.query(
        `INSERT INTO users (
            name, 
            email, 
            password, 
            profile_image
        ) VALUES (?, ?, ?, ?);
        `,
          [userName, userEmail, userPassword, profileImage]
    ) 
    res.status(201).json({ message : "userCreated"})
});

const PORT = process.env.PORT;

const start = async() => {
    app.listen(PORT, () => console.log(`Server is listening to ${PORT}`));
}

start();