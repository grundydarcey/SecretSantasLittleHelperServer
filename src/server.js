require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

knexInstance
  .select('member_name')
  .from('groupmembers')
  .where({ dollars: '100' })
  .then(result => {
    console.log(result);
  });