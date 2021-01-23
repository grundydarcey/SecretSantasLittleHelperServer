const MembersService = {
  getAllMembers(knex) {
    return knex.select('*').from('groupmembers');
  }
};

module.exports = MembersService;