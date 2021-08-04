//const { getCourseLearning } = require('../services/student.service');
const db = require('../utils/db');
const moment = require('moment');

module.exports = {
  async getFavoriteCoursesOfStudent(student_id){
    const favoriteList = await db('course').rightJoin(
      function(){
        this.select('course_id', 'id as favorite_course_id')
        .from('list_favorite')
        .where('student_id', student_id)
        .as('list')
      }, 'course.id', '=', 'list.course_id'
    )

    return favoriteList;
  }, 

  async deleteOneFavoriteCourse(course_id){
    const result = await db('list_favorite')
    .where({id: course_id})
    .del();

    return result;
  },

  async getCourseLearning(student_id, course_id){
    const student_course = await db
      .select(
        'sc.student_id',
        'sc.course_id',
        'course.title'
      )
      .from("student_course as sc")
      .leftJoin("course", "course.id", "sc.course_id")
      .where({student_id,course_id});
    
    if(student_course === null || student_course.length == 0)
      return null;
    const course_learning = student_course[0];
    const chaptersContent = await this.getContentChapter(course_id);

    //get chapter and video of course
    const chapters_fillter = chaptersContent.map((chapter,idxChapter) => {
      const temp = chaptersContent.filter(item => item.chapter_id == chapter.chapter_id);

      const videos = temp.map((item, idxVideo) => {
        if(idxChapter === 0 && idxVideo === 0){
          course_learning.video_source_learning = item.video_source;
        }
        return {
          video_id: item.video_id,
          video_title: item.video_title,
          duration: item.duration,
          video_source: item.video_source,
          isLearning: true,
        }
      }).filter((item) => item.video_id != null);

      return {
        chapter_id: chapter.chapter_id,
        chapter_title: chapter.chapter_title,
        course_id: chapter.course_id,
        videos: videos,
        sum_video_chapter: videos.length,
        sum_duration_chapter: videos.reduce((n, { duration }) => n + duration, 0)
      }
    })

    //add to result
    const chapters = [...new Map(chapters_fillter.map(obj => [JSON.stringify(obj), obj])).values()];
    course_learning.chapters = chapters;
    
    return course_learning;
  },

  getContentChapter(course_id){
    return db
    .select(
      'chapter.id as chapter_id',
      'chapter.title as chapter_title',
      'chapter.course_id',
      'video.id as video_id',
      'video.title as video_title',
      'video.duration',
      'video.video_source',
    )
    .from('chapter')
    .leftJoin('video', 'video.chapter_id', 'chapter.id')
    .where('chapter.course_id', course_id)
    .orderBy('chapter.id', 'asc');
  },

  async getHandleStudentCourse(student_id, course_id){
    const result = {
      isRegister : false,
      isFeedbacked : false,
      isFavorite : false
    };

    const register = await db('student_course as sc').where({student_id, course_id});
    if(register.length > 0){
      result.isRegister = true;
      if(register[0].vote){
        result.isFeedbacked = true;
      }
    }

    const favorite = await db('list_favorite').where({student_id, course_id});
    if(favorite.length > 0){
      result.isFavorite = true;
    }
    return result
  },

  async add({student_id,course_id}){
    const checkDuplicate = await db('student_course').where({student_id,course_id});
    if(checkDuplicate.length > 0)
      return false;

    const result = await db('student_course').insert({student_id,course_id});
    console.log(result);
    if(result.length > 0)
      return true;
    return false;
  },

  async updateComment(comment){
    const result = await db('student_course')
      .where({
        student_id: comment.student_id,
        course_id: comment.course_id
      })
      .update({
        vote: comment.newRating,
        comment: comment.newComment,
        vote_time: moment().format('YYYY-MM-DD hh:mm:ss')
      })
    return result > 0;
  },

  async getStudents(){
    const result = await db.select(
      'account.id', 'account.username', 'account.email', 
      'account.create_date', 'account_detail.fullname'
    ).from('account').leftJoin('account_detail', 'account.id',
    'account_detail.account_id' ).where('account.account_role', 3);

    return result;
  },

  async removeItemById(id) {
    const resultOnAccount = await db('account')
      .where('id', id)
      .del();
    const resultOnAccDetail = await db('account_detail')
    .where('id', id)
    .del();

    const result = [
      resultOnAccount,
      resultOnAccDetail
    ]
    return result;
  }
}