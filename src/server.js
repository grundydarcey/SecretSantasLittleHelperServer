require('dotenv').config();
const knex = require('knex');
const MembersService = require('./members-service');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});

//knexInstance('groupmembers').select('*')
//  .then(result => {
//    console.log(result);
//  });

// eslint-disable-next-line no-console
console.log(MembersService.getAllMembers());