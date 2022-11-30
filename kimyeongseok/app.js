const http = require ("http");
const express = require ("express");
const cors = require ("cors");
const morgan = require ("morgan");

const dotenv = require ("dotenv");
dotenv.config()

const bcrypt =require("bcrypt");
const saltRound = 12;

const { DataSource } = require('typeorm')

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
  const encrytedPassword = await bcrypt.hash( password, saltRound)
  await mysqlDataSource.query(
    `INSERT INTO users(
      name,
      profile_image,
      password,
      email
    ) VALUES (?, ?, ?, ?);
  `, [name, profile_image, encrytedPassword ,email]
  );
  res.status(201).json({message:"userCreated"});
})

const server = http.createServer(app)
const PORT = process.env.PORT;
 
const start = async () => {
 server.listen(PORT, () => console.log( `server is listening on ${PORT}`))
}

start()