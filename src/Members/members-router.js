/* eslint-disable quotes */
const express = require('express');
const xss = require('xss');
const path = require('path');
const MembersService = require('./members-service');

const membersRouter = express.Router();
const jsonParser = express.json();

const serializeMember = member => ({
  id: member.id,
  member_name: xss(member.member_name),
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
    //const knexInstance = req.app.get('db');
    const { member_name, dollars } = req.body;
    const newMember = { member_name, dollars };
    for (const [key, value] of Object.entries(newMember)) 
    // eslint-disable-next-line eqeqeq
      if (value == null) 
        return res.status(400).json({
          error: { message: `There is a Missing '${key}' in request body` }
        });

    MembersService.insertMember(
      req.app.get('db'),
      newMember
    )
      .then(member => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${member.id}`))
          .json(serializeMember(member));
      })
      .catch(next);
  });

membersRouter
  .route('/:member_id')
  .all((req, res, next) => {
    MembersService.getById(
      req.app.get('db'),
      req.params.member_id
    )
      .then(member => {
        if (!member) {
          return res.status(404).json({
            error: { message: `Member doesn't exist` }
          });
        }
        res.member = member;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeMember(res.member));
  })
  .delete((req, res, next) => {
    MembersService.deleteMember(
      req.app.get('db'),
      req.params.member_id
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
    const { member_name, dollars } = req.body;
    const memberToUpdate = { member_name, dollars };
    const numberOfValues = Object.values(memberToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'member_name' or 'dollars'`
        }
      });

    MembersService.updateMember(
      req.app.get('db'),
      req.params.member_id,
      memberToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = membersRouter;