const db = require('../utils/db');

const tableName = 'student_course';

module.exports = {
  async getVoteOfCourse(course_id) {
    const result = await db.raw(
      `select cast(avg(vote) as decimal(10,1)) as vote from ${tableName}
      where course_id = ${course_id} `
    )
    
    return result[0];
  },

  async getSubscriberOfCourse(course_id) {
    const subscriber = await db(tableName).count('student_id as subscriber')
      .where('course_id', course_id);
    return subscriber.length > 0 ? subscriber[0] : 0;
  },
}