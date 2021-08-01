const studentModel = require('../models/watchlist.model');
const { Code, Message } = require('../helper/statusCode.helper');

//#region QuangHai
async function addWatchlist ({student_id,course_id}) {
  let retData = {};
  const watchcourse = await studentModel.getOne({student_id,course_id});
  if(watchcourse){
    return {code: Code.Bad_Request, message: 'Đã có trong danh sách yêu thích'};
  }

  await studentModel.add({student_id,course_id});
  retData.code = Code.Created_Success;
  retData.message = Message.Created_Success;
  return retData;
}

async function deleteWatchlist (student_id,course_id) {
  const res = await studentModel.delete(student_id,course_id);
  if(res){
    return {code: Code.Deleted_Success, message: Message.Deleted_Success};
  }
  return {code: Code.Deleted_Fail, message: Message.Deleted_Fail};
}
//#endregion

module.exports = {
  addWatchlist,
  deleteWatchlist
}