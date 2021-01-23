require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

knexInstance('groupmembers').select('*')
  .then(result => {
    console.log(result);
  });
