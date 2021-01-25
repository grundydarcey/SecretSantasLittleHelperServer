/* eslint-disable quotes */
const express = require('express');
const xss = require('xss');
const MembersService = require('./members-service');

const membersRouter = express.Router();
const jsonParser = express.json();

const serializeMember = member => ({
  id: member.id,
  member_name: member.member_name,
  dollars: member.dollars,
});

membersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    MembersService.getAllMembers(knexInstance)
      .then(members => {
        res.json(members.map(serializeMember));  
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { member_name, dollars } = req.body;
    const newMember = { member_name, dollars };
    for (const [key, value] of Object.entries(newMember)) 
      // eslint-disable-next-line eqeqeq
      if (value == null) 
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    MembersService.insertMember(
      req.app.get('db'),
      newMember
    )
      .then(member => {
        res
          .status(201)
          .location(`/members/${member.id}`)
          .json(serializeMember(member));
      })
      .catch(next);
  });

membersRouter
  .route('/:member_id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    MembersService.getById(knexInstance, req.params.member_id)
      .then(member => {
        if (!member) {
          return res.status(404).json({
            error: { message: `Member doesn't exist` }
          });
        }
        res.json(serializeMember(member));
      })
      .catch(next);
  });

module.exports = membersRouter;