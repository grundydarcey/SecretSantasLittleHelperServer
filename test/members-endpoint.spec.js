/* eslint-disable quotes */
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeMembersArray, makeMaliciousMember } = require('./members.fixtures');

describe('Members Endpoints', function() {
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
  
  describe(`GET /api/members`, () => {
    context(`Given no members`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/members')
          .expect(200, []);
      });
    })

    context('Given there are members in the database', () => {
      const testMembers = makeMembersArray();
      beforeEach('insert members', () => {
        return db
          .into('groupmembers')
          .insert(testMembers);
      });

      it('responds with 200 and all of the members', () => {
        return supertest(app)
          .get('/api/members')
          .expect(200, testMembers)
      })
    })

    context(`Given an XSS attack member`, () => {
      const { maliciousMember, expectedMember } = makeMaliciousMember();

      beforeEach('insert malicious member', () => {
        return db
          .into('groupmembers')
          .insert([ maliciousMember ]);
      });

      it('removes XSS attack', () => {
        return supertest(app)
          .get(`/api/members`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].member_name).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist"> onerror="alert(document.cookie);"&gt;. But not <strong>all</strong> bad.`);
            expect(res.body[0].dollars).to.eql(0);
          });
      });
    });
  })

   
  describe(`GET /api/members/:memberId`, () => {
    context(`Given no members`, () => {
      it(`responds with 404`, () => {
        const memberId = 123456;
        return supertest(app)
          .get(`/api/members/${memberId}`)
          .expect(404, { error: { message: `Member doesn't exist` } });
      });
    })

    context('Given there are members in the database', () => {
      const testMembers = makeMembersArray();
      beforeEach('insert members', () => {
        return db
          .into('groupmembers')
          .insert(testMembers)
      })
      it('responds with 200 and the specified member', () => {
        const memberId = 2;
        const expectedMember = testMembers[memberId - 1];
        return supertest(app)
          .get(`/api/members/${memberId}`)
          .expect(200, expectedMember);
      });
    })


    context(`Given an XSS attack member`, () => {
      const { maliciousMember, expectedMember } = makeMaliciousMember();
      beforeEach('insert malicious member', () => {
        return db
          .into('groupmembers')
          .insert([ maliciousMember ])
      })

      it('removes XSS attack', () => {
        return supertest(app)
          .get(`/api/members/${maliciousMember.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.member_name).to.eql(expectedMember.member_name)
            expect(res.body.dollars).to.eql(expectedMember.dollars)
          })
      })
    })
  })

  describe(`POST /api/members`, () => {
    it(`creates a member, responding with 201 and the new member`, () => {
      const newMember = {
        member_name: 'Test new member',
        dollars: 1234
      };
      return supertest(app)
        .post('/api/members')
        .send(newMember)
        .expect(201)
        .expect(res => {
          expect(res.body.member_name).to.eql(newMember.member_name);
          expect(res.body.dollars).to.eql(newMember.dollars);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/members/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/members/${res.body.id}`)
            .expect(res.body)
        );
    });  

    const requiredFields = ['member_name', 'dollars'];
    requiredFields.forEach(field => {
      const newMember = {
        member_name: 'Test new member',
        dollars: 1234,
      };

      it(`responds with 400 and an errror message when the '${field}' is missing`, () => {
        delete newMember[field];
        return supertest(app)
          .post('/api/members')
          .send(newMember)
          .expect(400, {
            error: { message: `There is a Missing '${field}' in request body` }
          });
      });
    });

    it('removes XSS attack from response', () => {
      const { maliciousMember, expectedMember } = makeMaliciousMember();
      return supertest(app)
        .post(`/api/members`)
        .send(maliciousMember)
        .expect(201)
        .expect(res => {
          expect(res.body.member_name).to.eql(expectedMember.member_name)
          expect(res.body.dollars).to.eql(expectedMember.dollars)
        })
    })
  });

  
  describe(`DELETE /api/members/:memberId`, () => {
    context(`Given no members`, () => {
      it(`responds with 404`, () => {
        const memberId = 123456;
        return supertest(app)
          .delete(`/api/members/${memberId}`)
          .expect(404, { error: { message: `Member doesn't exist` } });
      });
    });
    
    context('Given there are members in the database', () => {
      const testMembers = makeMembersArray();
      beforeEach('insert members', () => {
        return db
          .into('groupmembers')
          .insert(testMembers);
      });

      it('responds with 204 and removes the member', () => {
        const idToRemove = 2;
        const expectedMembers = testMembers.filter(member => member.id !== idToRemove);
        return supertest(app)
          .delete(`/api/members/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/members`)
              .expect(expectedMembers)
          );
      });
    });
  });

  describe(`PATCH /api/members/:memberId`, () => {
    context(`Given no members`, () => {
      it(`responds with 404`, () => {
        const memberId = 123456;
        return supertest(app)
          .delete(`/api/members/${memberId}`)
          .expect(404, { error: { message: `Member doesn't exist` } })
      })
    })

    context('Given there are members in the database', () => {
      const testMembers = makeMembersArray();
      beforeEach('insert members', () => {
        return db
          .into('groupmembers')
          .insert(testMembers)
      })

      it('responds with 204 and updates the member', () => {
        const idToUpdate = 2;
        const updateMember = {
          member_name: 'updated name',
          dollars: 0,
        }
        const expectedMember = {
          ...testMembers[idToUpdate - 1],
          ...updateMember
        }
        return supertest(app)
          .patch(`/api/members/${idToUpdate}`)
          .send(updateMember)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/members/${idToUpdate}`)
              .expect(expectedMember)
            )
      })

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/members/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain either 'member_name' or 'dollars'`
            }
          })        
    })

    it('responds with 204 when updating only a subset of fields', () => {
      const idToUpdate = 2;
      const updateMember = {
        member_name: 'updated name',
      }
      const expectedMember = {
        ...testMembers[idToUpdate -1],
        ...updateMember
      }

      return supertest(app)
        .patch(`/api/members/${idToUpdate}`)
        .send({
          ...updateMember,
          fieldToIgnore: 'should not be in GET response'
        })
        .expect(204)
        .then(res => 
          supertest(app)
            .get(`/api/members/${idToUpdate}`)
            .expect(expectedMember)
          )
      })
    })
  })
})