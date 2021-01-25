const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');

describe.only('Members Endpoints', function() {
  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });
  after('disconnect from db', () => db.destroy());
  before('clean the table', () => db('groupmembers').truncate());
  afterEach('cleanup', () => db('groupmembers').truncate());
  context('Given there are members in the database', () => {
    const testMembers = [
      {
        id: 1,
        member_name: 'Danny',
        dollars: 20,
      },
      {
        id: 2,
        member_name: 'DJ',
        dollars: 20,
      },
      {
        id: 3,
        member_name: 'Stephanie',
        dollars: 20,
      },
      {
        id: 4,
        member_name: 'Michelle',
        dollars: 20,
      },
    ];

    beforeEach('insert members', () => {
      return db
        .into('groupmembers')
        .insert(testMembers);
    });

    it('GET /members responds with 200 and all of the members', () => {
      return supertest(app)
        .get('/members')
        .expect(200, testMembers);
    });
  });
});