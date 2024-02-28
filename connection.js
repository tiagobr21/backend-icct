
const {Pool} = require('pg')
require('dotenv').config();

//connection
var pool  = new Pool({
   port: process.env.DB_PORT,
   host: process.env.DB_HOST,
   user: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME
});

 module.exports = pool;



