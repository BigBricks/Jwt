const express = require('express');
const mongoose = require('mongoose');;
const cors = require('cors');
const setupRoutes = require('./config/routes');

const server = express();

mongoose
  .connect('mongodb://localhost/jwtdb')
  .then(conn => {
    console.log('\n connected to mongo \n');
  })
  .catch(err => console.log('error connecting to mongo', err));


server.use(express.json());

setupRoutes(server);


server.listen(5000, () => console.log('\n api running on 5k \n'));