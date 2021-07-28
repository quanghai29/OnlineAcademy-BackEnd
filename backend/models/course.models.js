const { getBestSellerCoursesByCategory } = require("../services/course.service");
const db = require("../utils/db");

const table_name = 'course';
module.exports = {
  all() {
    return db(table_name);
  },

  async single(id) {
    const courses = await db(table_name).where('id', id);
    if (courses.length === 0) {
      return null;
    }

    return courses[0];
  },

  updateCourseImage(image_id, course_id) {
    return db(table_name).where('id', course_id).update({ img_id: image_id });
  },

  add(course) {
    return db(table_name).insert(course);
  },

  async allByCategory(category_id) {
    const courses = await db
      .select('course.*', 'image.img_source', 'image.img_title')
      .from('course')
      .where('course.category_id', category_id)
      .leftJoin('image', 'image.id', 'course.img_id');
    //const courses = await db(table_name).where('category_id', category_id);
    if (courses.length === 0) {
      return null;
    }

    return courses;
  },

  async coursesByCategory(category_id){
    const courses = await db(table_name).where('category_id', category_id);
    return courses;
  },

  async fullTextSearchCourse(text) {
    const sql = `
    SELECT *, MATCH (title, short_description, full_description) 
    AGAINST ('${text}') as score
    FROM course WHERE MATCH (title, short_description, full_description) 
    AGAINST ('${text}') > 0 ORDER BY score DESC;
    `;
    const courses = await db.raw(sql);

    if (courses.length === 0) {
      return null;
    }

    return courses[0];
  },

  async getLatestCourses(amount) {
    const courses = await db
      .select(
        'c.*',
        db.raw('CAST(AVG(sc.vote) AS DECIMAL(10,1)) AS rating'),
        'ad.fullname as lecturer_name'
        )
      .from('course as c')
      .leftJoin('student_course as sc', 'sc.course_id', 'c.id')
      .leftJoin('account_detail as ad', 'ad.account_id', 'c.lecturer_id')
      .groupBy('c.id')
      .orderBy('create_date', 'desc')
      .limit(amount);
    if (courses.length === 0) {
      return null;
    }

    return courses;
  },

  async getMostViewCourses(amount) {
    const courses = await db.raw(`
    SELECT c.*, SUM(v.views) AS sum_view, DATE_FORMAT(v.upload_date, '%m/%d/%Y'), CAST(AVG(vote) AS DECIMAL(10,1)) AS rating, ad.fullname as lecturer_name 
    FROM course AS c 
    LEFT JOIN chapter AS ch ON c.id = ch.course_id 
    LEFT JOIN video AS v ON ch.id = v.chapter_id 
    LEFT JOIN student_course AS sc ON c.id = sc.course_id 
    LEFT JOIN account_detail AS ad ON c.lecturer_id = ad.account_id 
    WHERE v.upload_date BETWEEN NOW() - INTERVAL 30 DAY AND NOW() 
    GROUP BY ch.course_id 
    ORDER BY sum_view DESC LIMIT ${amount}
    `);

    if (courses.length === 0) {
      return null;
    }

    return courses[0];
  },

  async getBestSellerCourseByCategory(catId, amount) {
    const courses = await db.raw(`
    SELECT course_id, COUNT(*) AS total_course, DATE_FORMAT(register_date, '%m/%d/%Y') 
    FROM student_course 
    INNER JOIN course 
    ON course_id = course.id 
    WHERE (register_date BETWEEN NOW() - INTERVAL 30 DAY AND NOW()) AND category_id=${catId} 
    GROUP BY course_id
    ORDER BY total_course DESC LIMIT ${amount};
    `);

    if (courses.length === 0) {
      return null;
    }

    return courses[0];
  },

  async outstandingCourses() {
    const courses = await db('course')
      .rightJoin(
        function () {
          this.select('course_id')
            .sum({ sum_vote: 'vote' })
            .from('student_course')
            .whereRaw('datediff(curdate(), register_date) <= 7')
            .groupBy('course_id')
            .orderBy('sum_vote', 'desc')
            .as('sum_vote');
        },
        'course.id',
        '=',
        'sum_vote.course_id'
      )
      .limit(4);

    return courses;
  },

  async getComments(course_id) {
    const comments = await db
      .select(
        'sc.id',
        'sc.student_id',
        'ac.fullname',
        'sc.course_id',
        'sc.vote',
        db.raw('date_format(sc.register_date,"%d/%m/%Y") as vote_time'),
        'sc.comment'
      )
      .from('student_course as sc')
      .where('course_id',course_id)
      .whereNotNull('comment')
      .leftJoin('account_detail as ac','ac.account_id','sc.student_id')
    if(comments)
        return comments;
    return null;
  },

  async addComment(comment) {
    const result = await db('comment').insert({
      content: comment.content,
      student_id: comment.student_id,
      course_id: comment.course_id
    });

    console.log('add comment', result);
    return result;
  },

  async detail(course_id) {
    const courses = await db
      .select(
        'course.*',
        'category.category_name',
        'account_detail.fullname as lecturer_name',
        'account_detail.headline as lecturer_headline',
        'account_detail.description as lecturer_description',
        'account_detail.img_profile as lecturer_imgprofile',
        'image.img_source as course_img_source',
        'image.img_title as course_img_title',
        db.raw('CAST(AVG(sc.vote) AS DECIMAL(10,1)) AS num_rating')
      )
      .count('sc.id as num_register')
      .count('sc.vote as num_feedback')
      .from('course')
      .where('course.id', course_id)
      .leftJoin('account_detail', 'account_detail.account_id', 'course.lecturer_id')
      .leftJoin('image', 'image.id', 'course.img_id')
      .leftJoin('student_course as sc', 'sc.course_id', 'course.id')
      .leftJoin('category', 'category.id', 'course.category_id')
      ;

    if (courses.length > 0) {
      let course = courses[0];

      //get all chapter

      const chaptersContent = await this.getContentChapter(course_id);

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

      const chapters = [...new Map(chapters_fillter.map(obj => [JSON.stringify(obj), obj])).values()];

      course.chapters = chapters;
      course.sum_video_course = chapters.reduce((n, { sum_video_chapter }) => n + sum_video_chapter, 0);
      course.sum_duration_course = chapters.reduce((n, { sum_duration_chapter }) => n + sum_duration_chapter, 0);

      //get voted


      return course;
    }

    return null;
  },

  getContentChapter(course_id) {
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
  },

  getVotedCourse(course_id) {
    return db
      .from('student_course')
      .where('course_id', course_id)
  },

  async getVotedAVGCourse(course_id) {
    const item = await db.raw(`
    SELECT course_id, CAST(AVG(vote) as DECIMAL(10,1)) as num_rating
    FROM student_course 
    WHERE course_id = ${course_id} 
    GROUP BY course_id;
    `);
    if(item[0].length === 0) {
      return null;
    }
    return item[0]; 
  }
};

