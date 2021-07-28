const { Code, Message } = require('../helper/statusCode.helper');
const courseModel = require('../models/course.models');
const moment = require('moment');
const accountModel = require('../models/account.model')
const imageModel = require('../models/image.model');
const studentCourseModel = require('../models/student_course.model');
const categoryModel = require("../models/category.models");

//#region Quang Hai MTP
async function getCourseDetail(id) {
  let returnModel = {}; // code; message; data
  const course = await courseModel.detail(id);
  if (course == null) {
    returnModel.code = Code.Not_Found;
  } else {
    course.last_update = moment(course.last_update).format('MM/YYYY');
    course.create_date = moment(course.create_date).format('DD/MM/YYYY');
    returnModel.code = Code.Success;
    returnModel.data = course;
  }
  return returnModel;
}

//#endregion

//#region TienDung

async function insertCourse(course) {
  let returnModel = {};
  const ret = await courseModel.add(course);
  course.id = ret[0];
  returnModel.code = Code.Created_Success;
  returnModel.message = Message.Created_Success;
  returnModel.data = course;
  return returnModel;
}

async function getLatestCourses(amount) {
  let returnModel = {};
  const ret = await courseModel.getLatestCourses(amount);

  if (ret == null) {
    returnModel.code = Code.Not_Found;
  } else {
    returnModel.code = Code.Success;
    returnModel.data = ret;
  }
  return returnModel;
}

async function getMostViewCourses(amount) {
  let returnModel = {};
  const ret = await courseModel.getMostViewCourses(amount);

  if (ret == null) {
    returnModel.code = Code.Not_Found;
  } else {
    returnModel.code = Code.Success;
    returnModel.data = ret;
  }
  return returnModel;
}

async function getBestSellerStudent_CoursesByCategory(catId, amount) {
  const ret = await courseModel.getBestSellerCourseByCategory(catId, amount);
  return ret;
}

async function getBestSellerCoursesByCategory(catId, amount) {
  let returnModel = {};
  const ret = await getBestSellerStudent_CoursesByCategory(catId, amount);

  const ret2 = await Promise.all(
    ret.map(async (item) => {
      let course = await courseModel.single(item.course_id);
      course.view_sum = item.sum_view;
      return course;
    })
  );

  if (ret2 == null) {
    returnModel.code = Code.Not_Found;
  } else {
    returnModel.code = Code.Success;
    returnModel.data = ret2;
  }
  return returnModel;
}

//#endregion

//#region Mai Linh Đồng
async function getCourseByCategory(category_id) {
  let returnModel = {};

  const courses = await courseModel.allByCategory(category_id);
  if (!courses) {
    returnModel.code = Code.Bad_Request;
    returnModel.message = Message.Bad_Request;
  } else {
    returnModel.code = Code.Success;
    returnModel.message = Message.Success;
  }
  returnModel.data = courses;

  return returnModel;
}

async function getFullDataCourses(courses) {
  let temp = 0;
  for (let i = 0; i < courses.length; i++) {
    courses[i].author = await accountModel.getAccountDetail(courses[i].lecturer_id);
    temp = await studentCourseModel.getVoteOfCourse(courses[i].id);
  
    courses[i].avg_vote = +temp[0].vote || 0;
    temp = await studentCourseModel.getSubscriberOfCourse(courses[i].id);
    courses[i].subscriber = temp.subscriber;
    courses[i].image = await imageModel.getImageById(courses[i].img_id);
    delete courses[i].lecturer_id;
    delete courses[i].img_id;
  }
  return courses;
}

async function findCourse(text) {
  let retData = {
    data: {
      courses: [],
      keyWord: ''
    },
    code: null,
    message: ''
  };
  if (text) {
    retData.data.keyWord = text;
    //get data from course table
    const courses = await courseModel.fullTextSearchCourse(text);
    if (courses.length > 0) {
      retData.data.courses = await getFullDataCourses(courses);
    } else {
      const categories = await categoryModel.fullTextSearchCategory(text);
      if (categories.length > 0) {
        let arrCourses = [];
        for (let i = 0; i < categories.length; i++) {
          let courses = await courseModel.coursesByCategory(categories[i].id);
          arrCourses = arrCourses.concat(courses);
        }
        retData.data.courses=await getFullDataCourses(arrCourses);
      } else {
        retData.data.courses = [];
      }
    }
    retData.code = Code.Success;
    retData.message = Message.Success;
  } else {
    retData.code = Code.Bad_Request;
    retData.message = Message.Bad_Request;
  }

  return retData;
}

async function getOutstandingCourses() {
  let retData = {};
  const courses = await courseModel.outstandingCourses();
  retData.code = Code.Success;
  retData.message = Message.Success;
  retData.data = courses;

  return retData;
}

async function getCommentsOfCourse(course_id) {
  let retData = {};
  const comments = await courseModel.getComments(course_id);
  if(comments === null){
    retData.code = Code.Not_Found;
  }else {
    retData.code = Code.Success;
    retData.message = Message.Success;
    retData.data = comments;
  }
  return retData;
}

async function addComment(comment) {
  let retData = {};
  const result = await courseModel.addComment(comment);
  retData.code = Code.Created_Success;
  retData.message = Message.Created_Success;
  comment.comment_id = result[0];
  retData.data = { ...comment };

  return retData;
}
//#endregion

module.exports = {
  getCourseDetail,
  insertCourse,
  getCourseByCategory,
  findCourse,
  getLatestCourses,
  getOutstandingCourses,
  getMostViewCourses,
  getBestSellerCoursesByCategory,
  getCommentsOfCourse,
  addComment
};
