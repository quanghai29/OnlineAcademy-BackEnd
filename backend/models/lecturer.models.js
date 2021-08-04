const db = require('../utils/db');

const table_name = 'lecturer';
module.exports = {
  async getLecturerById(id) {
    const lecturer = await db(table_name).where('id', id);
    if (lecturer.length === 0) {
      return null;
    }

    return lecturer[0];
  },

  async getLecturers(){
    const result = await db.select(
      'account.id', 'account.username','account.password', 'account.email', 
      'account.create_date', 'account_detail.creator'
    ).from('account').leftJoin('account_detail', 'account.id',
    'account_detail.account_id' ).where('account.account_role', 2);

    return result;
  },
};
