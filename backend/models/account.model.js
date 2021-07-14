
const db = require('../utils/db');

const table_name = 'account';
module.exports = {
  addAccount(account) {
    return db(table_name).insert(account);
  },

  async getSingleAccountByEmail(email) {
    const result = await db(table_name).where('email', email);
    return result.length > 0 ? result[0] : null;
  },

  async getSingleAccountByUsername(username) {
    const result = await db(table_name).where('username', username);
    return result.length > 0 ? result[0] : null;
  },

  updateRefreshToken(id, refreshToken) {
    return db(table_name).where('id', id).update('rfToken', refreshToken);
  },

  async isValidRefreshToken(id, refreshToken) {
    const list = await db(table_name)
      .where('id', id)
      .andWhere('rfToken', refreshToken);
    if (list.length > 0) {
      return true;
    }

    return false;
  },

  activeEmail(accountId){
    return db(table_name).where('id', accountId).update('confirm_email', true);
  }
};
