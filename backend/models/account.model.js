
const db = require('../utils/db');

const table_name = 'account';
module.exports = {
  addAccount(account) {
    return db(table_name).insert(account);
  },

  addAccountDetail(data){
    return db('account_detail').insert(data);
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

  async activeEmail(accountId) {
    return await db(table_name).where('id', accountId).update('confirm_email', true);
  },

  async getAccountDetail(account_id) {
    const accountDetail = await db('account_detail').where('account_id', account_id);
    return accountDetail.length ? accountDetail[0] : null;
  }
};
