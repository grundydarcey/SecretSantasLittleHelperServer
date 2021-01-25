/* eslint-disable quotes */
const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeMembersArray } = require('./members.fixtures');

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
  
  context(`Given no members`, () => {
    it(`responds with 200 and an empty list`, () => {
      return supertest(app)
        .get('/members')
        .expect(200, []);
    });

    it(`responds with 404`, () => {
      const memberId = 123456;
      return supertest(app)
        .get(`/members/${memberId}`)
        .expect(404, { error: { message: `Member doesn't exist` } });
    });
  });
  
  describe.only(`GET /members/:member_id`, () => {
    context('Given there are members in the database', () => {
      const testMembers = makeMembersArray();
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

      it('GET /members/:member_id responds with 200 and the specified member', () => {
        const memberId = 2;
        const expectedMember = testMembers[memberId - 1];
        return supertest(app)
          .get(`/members/${memberId}`)
          .expect(200, expectedMember);
      });
    });

    context(`Given an XSS attack member`, () => {
      const maliciousMember = {
        id: 911,
        member_name: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        dollars: -12463
      };

      beforeEach('insert malicious member', () => {
        return db
          .into('groupmembers')
          .insert([ maliciousMember ]);
      });

      it('removes XSS attack', () => {
        return supertest(app)
          .get(`/members/${maliciousMember.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.member_name).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`);
            expect(res.body.dollars).to.eql(-12463);
          });
      });
    });
  });

  describe.only(`POST /members`, () => {
    it(`creates a member, responding with 201 and the new member`, function() {
      const newMember = {
        member_name: 'Test new member',
        dollars: 1234
      };
      return supertest(app)
        .post('/members')
        .send(newMember)
        .expect(201)
        .expect(res => {
          expect(res.body.member_name).to.eql(newMember.member_name);
          expect(res.body.dollars).to.eql(newMember.dollars);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/members/${res.body.id}`);
        })
        .then(postRes =>
          supertest(app)
            .get(`/members/${postRes.body.id}`)
            .expect(postRes.body)
        );
    });  

    const requiredFields = ['member_name', 'dollars'];
    requiredFields.forEach(field => {
      const newMember = {
        member_name: 'newbie',
        dollars: 1
      };

      it(`responds with 400 and an errror message when the '${field}' is missing`, () => {
        delete newMember[field];
        return supertest(app)
          .post('/members')
          .send(newMember)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          });
      });
    });
  });
});


