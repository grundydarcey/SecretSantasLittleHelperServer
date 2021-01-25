/* eslint-disable no-console */
const knex = require('knex');
const { PORT, DATABASE_URL, TEST_DATABASE_URL } = require('./config');
const app = require('./app');

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
