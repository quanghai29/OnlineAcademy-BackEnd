const { Code, Message } = require('../helper/statusCode.helper');
const categoryModel = require('../models/category.models');
const moment = require('moment');


//#region Quang Hai MTP
async function getAllCategory() {
  let returnModel = {}; // code; message; data
  const categories = await categoryModel.all();
  if (categories == null) {
    returnModel.code = Code.Not_Found;
  } else {
    categories.forEach(category => {
      category.last_update = moment(category.last_update).format('DD/MM/YYYY HH:mm:ss');
    });
    returnModel.code = Code.Success;
    returnModel.data = categories;
  }
  return returnModel;
}

async function getMostRegister({ duration, amount }) {
  let returnModel = {}; // code; message; data
  const categories = await categoryModel.getMostRegister({ duration, amount });
  if (categories == null) {
    returnModel.code = Code.Not_Found;
  } else {
    returnModel.code = Code.Success;
    returnModel.data = categories;
  }
  return returnModel;
}

//#endregion

//#region Mai Linh Đồng
async function findCategory(text) {
  const retData = {};
  if (text) {
    const result = await categoryModel.fullTextSearchCategory(text);
    retData.data = result ? result : [];
    retData.code = Code.Success;
    retData.message = Message.Success;
  } else {
    retData.code = Code.Bad_Request;
    retData.message = Message.Bad_Request;
  }

  return retData;
}

async function getExpandedInfo() {
  let returnModel = {}; // code; message; data
  const categories = await categoryModel.getExpandedInfo();
  categories.forEach(category => {
    category.last_update = moment(category.last_update).format('DD/MM/YYYY');
    delete category.course_id;
  });
 
  returnModel.code = Code.Success;
  returnModel.categories = categories;
  return returnModel;
}
//#endregion


module.exports = {
  getAllCategory,
  getMostRegister,
  findCategory,
  getExpandedInfo
};
