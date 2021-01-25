/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
//const { PORT } = require('./config');
//const MembersService = require('./members-service');
const MembersRouter = require('./Members/members-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/members', MembersRouter);

///END POINT SECRETSANTASLITTLEHELPER/ GET RECEIVES 'HELLO WORLD'
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

//END POINT SECRETSANTASLITTLEHELPER.COM/MEMBERS RECEIVES THE WHOLE FAM
/*app.get('/members', (req, res, next) => {
  const knexInstance = req.app.get('db');
  MembersService.getAllMembers(knexInstance)
    .then(members => {
      res.json(members);
    })
    .catch(next);
});*/

//END POINT SECRETSANTASLITTLEHELPER.COM/MEMBERS/SPECIFICMEMBERID RECEIVES A SPECIFIC MEMBER
/*app.get('/members/:member_id', (req, res, next) => {
  const knexInstance = req.app.get('db');
  MembersService.getById(knexInstance, req.params.member_id)
    .then(member => {
      if (!member) {
        return res.status(404).json({
          error: { message: `Member doesn't exist` }
        });
      }
      res.json(member);
    })
    .catch(next);
});*/

//END POINT TO POST A NEW MEMBER /MEMBERS
/*app.post('/members', jsonParser, (req, res, next) => {
  const { member_name, dollars } = req.body;
  const newMember = { member_name, dollars };
  MembersService.insertMember(
    req.app.get('db'),
    newMember
  )
    .then(member => {
      res
        .status(201)
        .location(`/members/${member.id}`)
        .json(member);
    })
    .catch(next);
});*/

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

module.exports = app;