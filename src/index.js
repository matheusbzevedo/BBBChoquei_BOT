require('dotenv').config();
const app = require('express');
const server = app();
const port = process.env.PORT || 3000;
const keys = require('./config/index');


console.log(keys);


server.listen(() => console.log(`Server listening on port: ${port}`));
