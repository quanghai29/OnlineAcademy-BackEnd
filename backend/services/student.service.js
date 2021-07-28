const studentModel = require('../models/student.models');
const { Code, Message } = require('../helper/statusCode.helper');

//#region Mai Linh Đồng
async function getFavoriteCourses(student_id) {
  let retData = {};
  const courses = await studentModel.getFavoriteCoursesOfStudent(student_id);
  retData.code = Code.Success;
  retData.message = Message.Success;
  retData.data = courses;

  return retData;
}

async function deleteOneFavorite(student_id, course_id){
  let retData = {};
  const deletedInfo = await studentModel.deleteOneFavoriteCourse(student_id, course_id);
  retData.code = Code.Success;
  retData.message = Message.Success;
  retData.data = deletedInfo

  return retData;
}
//#endregion

//#region QuangHai
async function getCourseLearning(student_id, course_id){
  let returnModel = {code: Code.Forbidden, message: Message.Forbidden}; // code; message; data
  if(student_id === null || course_id === null)
    return returnModel;

  const course = await studentModel.getCourseLearning(student_id, course_id);
  if (course == null) {
    returnModel.code = Code.Not_Found;
  } else {
    returnModel.code = Code.Success;
    returnModel.data = course;
  }
  return returnModel;
}


//#endregion

module.exports = {
  getFavoriteCourses, 
  deleteOneFavorite,
  getCourseLearning
}