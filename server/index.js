const express = require('express')
const cors = require('cors')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');  

const mongoose = require("mongoose");

const { connectToMongoDB } = require("./connect");
const { register, login, tokenValidator } = require('./controller/AuthController');

const app = express()
const port = 5000

// To handle cookie 
app.use(cookieParser()); 
// Middleware to handle Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




const dbURL = "mongodb+srv://abhijeetmahavar:abhijeet@cluster0.xa7yxyl.mongodb.net/?retryWrites=true&w=majority";
connectToMongoDB(dbURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });




  app.get('/', (req, res) => {
    console.log(req);
    res.send('Hello World!')
  })
  
  
  app.get('/auth', tokenValidator);
  
  
  
  app.post('/signup', register);

  app.post('/login', login);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})