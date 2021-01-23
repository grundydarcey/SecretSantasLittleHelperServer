/* eslint-disable quotes */
const MembersService = require('../src/members-service');
const knex = require('knex');

describe(`Members service object`, function() {
  let db;
  let testMembers = [
    {
      id: 1,
      member_name: 'Rously',
      dollars: 200
    },
    {
      id: 2,
      member_name:'Dominique',
      dollars: 200
    },
    {
      id: 3,
      member_name: 'Raynique',
      dollars: 200
    },
    {
      id: 4,
      member_name: 'Jeffrey',
      dollars: 200
    },
    {
      id: 5,
      member_name: 'Ginger',
      dollars: 200
    },
  ];
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
  });
  before(() => db('groupmembers').truncate());
  before(() => {
    return db
      .into('groupmembers')
      .insert(testMembers);
  });
  after(() => db.destroy());
  describe(`getAllMembers()`, () => {
    it(`resolves all members from the 'groupmembers' database`, () => {
      return MembersService.getAllMembers(db)
        .then(actual => {
          expect(actual).to.eql(testMembers);
        });
    });
  });
});