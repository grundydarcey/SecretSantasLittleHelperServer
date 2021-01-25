const MembersService = {
  getAllMembers(knex) {
    return knex.select('*').from('groupmembers');
  },
  insertMember(knex, newMember) {
    return knex
      .insert(newMember)
      .into('groupmembers')
      .returning('*');
    //.then(rows => {
    //  return rows[0];
    //});
  },
  getById(knex, id) {
    return knex
      .from('groupmembers')
      .select('*')
      .where('id', id)
      .first();
  },
  deleteMember(knex, id) {
    return knex('groupmembers')
      .where({ id })
      .delete();
  },
  updateMember(knex, id, newMemberFields) {
    return knex('groupmembers')
      .where({ id })
      .update(newMemberFields);
  }
};

module.exports = MembersService;