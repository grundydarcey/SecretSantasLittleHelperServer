/* eslint-disable quotes */
const MembersService = require('../src/members-service');
const knex = require('knex');
const { expect } = require('chai');

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
  afterEach(() => db('groupmembers').truncate());
  after(() => db.destroy());
  context(`Given 'groupmembers' has data`, () => {
    beforeEach(() => {
      return db
        .into('groupmembers')
        .insert(testMembers);
    });

    it(`getAllMembers() resolves all members from the 'groupmembers' database`, () => {
      return MembersService.getAllMembers(db)
        .then(actual => {
          expect(actual).to.eql(testMembers);
        });
    });

    it(`getById() resolves a member by id from 'groupmembers' table`, () => {
      const thirdId = 3;
      const thirdTestMember = testMembers[thirdId - 1];
      return MembersService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            member_name: thirdTestMember.member_name,
            dollars: thirdTestMember.dollars,
          });
        });
    });

    it(`deleteMember() removes a member by id from 'groupmembers' table`, () => {
      const memberId = 3;
      return MembersService.deleteMember(db, memberId)
        .then(() => MembersService.getAllMembers(db))
        .then(allMembers => {
          [
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
              id: 4,
              member_name: 'Jeffrey',
              dollars: 200
            },
            {
              id: 5,
              member_name: 'Ginger',
              dollars: 200
            }
          ];
          const expected = testMembers.filter(member => member.id !== memberId);
          expect(allMembers).to.eql(expected);
        });
    });

    it(`updateMember() updates an article from the 'groupmember' tables`, () => {
      const idOfMemberToUpdate = 3;
      const newMemberData = {
        member_name: 'updated member name',
        dollars: 350,
      };
      return MembersService.updateMember(db, idOfMemberToUpdate, newMemberData)
        .then(() => MembersService.getById(db, idOfMemberToUpdate))
        .then(member => {
          expect(member).to.eql({
            id: idOfMemberToUpdate,
            ...newMemberData,
          })
        })
    })
  });

  context(`Given 'groupmembers' has no data`, () => {
    it(`getAllMembers() resolves an empty array`, () => {
      return MembersService.getAllMembers(db)
        .then(actual => {
          expect(actual).to.eql([]);
        });
    });
  });

  it(`insertMember() inserts a new group member and resolves the new member with an 'id'`, () => {
    const newMember = {
      member_name: 'Darcey',
      dollars: 5000000,
    };
    return MembersService.insertMember(db, newMember)
      .then(actual => {
        expect(actual).to.eql({
          id: 1,
          member_name: newMember.member_name,
          dollars: newMember.dollars,
        });
      });
  });
});