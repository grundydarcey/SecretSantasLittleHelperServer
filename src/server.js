/* eslint-disable no-console */
//require('dotenv').config();
const knex = require('knex');
//const MembersService = require('./members-service');
const { PORT, DATABASE_URL } = require('./config');
const app = require('./app');

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

//const knexInstance = knex({
//  client: 'pg',
//  connection: DATABASE_URL,
//});

app.set('db', db);

//MembersService.getAllMembers(knexInstance)
//.then(members => console.log(members))
//.then(() =>
//MembersService.insertMember(knexInstance, {
//member_name: 'new member',
//dollars: new Number(),
//})
//)
//.then(newMember => {
//console.log(newMember);
//return MembersService.updateMember(
//knexInstance,
//newMember.id,
//{ member_name: 'updated member name' }
//).then(() => MembersService.getById(knexInstance, newMember.id));
//})
//.then(member => {
//console.log(member);
//return MembersService.deleteMember(knexInstance, member.id);//});


//knexInstance('groupmembers').select('*')
//  .then(result => {
//    console.log(result);
//  });

// eslint-disable-next-line no-console
//console.log(MembersService.getAllMembers());

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
