/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
//const { PORT } = require('./config');
const MembersService = require('./members-service');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

///END POINT SECRETSANTASLITTLEHELPER/GET RECEIVES 'HELLO WORLD'
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

//END POINT SECRETSANTASLITTLEHELPER.COM/MEMBERS RECEIVES THE WHOLE FAM
app.get('/members', (req, res, next) => {
  const knexInstance = req.app.get('db');
  MembersService.getAllMembers(knexInstance)
    .then(members => {
      res.json(members);
    })
    .catch(next);
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

//app.listen(PORT, () => {
//  console.log(`Server listening at http://localhost:${PORT}`);
//});

module.exports = app;