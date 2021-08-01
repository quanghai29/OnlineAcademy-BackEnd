const db = require("../utils/db");

const table_name = 'list_favorite';
module.exports = {
  all() {
    return db(table_name);
  },

  async single(id) {
    const watchlist = await db(table_name).where('id', id);
    if (watchlist.length === 0) {
      return null;
    }

    return watchlist[0];
  },

  async getOne({student_id, course_id}){
    const watchcourse =await db.from(table_name).where({student_id, course_id});
    if(watchcourse.length > 0)
      return watchcourse[0];
    return null;
  },

  add(watchcourse) {
    return db(table_name).insert(watchcourse);
  },

  delete(student_id, course_id){
    return db.from(table_name).where({student_id,course_id}).del();
  }
}