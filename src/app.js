/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const MembersRouter = require('./Members/members-router');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler);

app.use('/api/members', MembersRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

module.exports = app;