const { Code, Message } = require('../helper/statusCode.helper');
const lecturerModel = require('../models/lecturer.models');
const moment = require('moment');

//#region TienDung

async function getLecturerById(id) {
  let returnModel = {};

  const lecturer = await lecturerModel.getLecturerById(id);
  if (lecturer == null) {
    returnModel.code = Code.Not_Found;
  } else {
    lecturer.last_update = moment(lecturer.last_update).format(
      'DD/MM/YYYY HH:mm:ss'
    );
    returnModel.code = Code.Success;
    returnModel.message = Message.Success;
    returnModel.data = lecturer;
  }
  return returnModel;
}

//#endregion

async function getLecturers(){
  let retData = {};
  const result = await lecturerModel.getLecturers();
  if (result.length > 0) {
    result.forEach(lecturer => {
      lecturer.create_date = moment(lecturer.create_date).format('DD/MM/YYYY');
    })
    retData.code = Code.Success;
    retData.message = Message.Success;
    retData.data = result;
  } else {

  }

  return retData;
}

module.exports = {
  getLecturerById,
  getLecturers
};
