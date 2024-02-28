const express = require('express');
var cors =require('cors');
const connection = require('./connection');
const userRoute = require('./routes/user');
const booksRoute = require('./routes/books');
const pool = require('./connection');
const app = express();


 app.get("/",(req,res)=>{
    res.end("Hello World ");
}) 

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user',userRoute);
app.use('/books',booksRoute);

module.exports = app;