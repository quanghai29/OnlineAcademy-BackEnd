const db = require('../utils/db');

const tableName = 'student_course';

module.exports = {
  async getVoteOfCourse(course_id) {
    const vote = await db(tableName).sum('vote as vote')
      .where('course_id', course_id);
    return vote.length > 0 ? vote[0] : 0;
  },

  async getSubscriberOfCourse(course_id) {
    const subscriber = await db(tableName).count('student_id as subscriber')
      .where('course_id', course_id);
    return subscriber.length > 0 ? subscriber[0] : 0;
  },
}