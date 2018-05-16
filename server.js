const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');
const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/jwtdb')
  .then(conn => {
    console.log('\n connected to mongo \n');
  })
  .catch(err => console.log('error connecting to mongo', err));

const server = express();
server.use(express.json());
server.use(cors());


server.listen(5000, () => console.log('\n api running on 5k \n'));