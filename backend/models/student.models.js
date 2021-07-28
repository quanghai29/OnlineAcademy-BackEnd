//const { getCourseLearning } = require('../services/student.service');
const db = require('../utils/db');

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
    
    if(student_course === null)
      return null;
    const course_learning = student_course[0];
    const chaptersContent = await this.getContentChapter(course_id);

    //get chapter and video of course
    const chapters_fillter = chaptersContent.map(chapter => {
      const temp = chaptersContent.filter(item => item.chapter_id == chapter.chapter_id);

      const videos = temp.map((item) => {
        return {
          video_id: item.video_id,
          video_title: item.video_title,
          duration: item.duration,
          isPreview: item.isPreview
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
      'video.isPreview'
    )
    .from('chapter')
    .leftJoin('video', 'video.chapter_id', 'chapter.id')
    .where('chapter.course_id', course_id)
    .orderBy('chapter.id', 'asc');
  }
}