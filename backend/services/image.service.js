const { Code, Message } = require('../helper/statusCode.helper');
const imageModel = require('../models/image.models');
const courseModel = require('../models/course.models');

//#region TienDung

async function insertImage(image, course_id) {
    let returnModel = {};
    const ret = await imageModel.add(image);
    image.img_id = ret[0];

    if(image.img_id === null)
        return {code: Code.Created_Fail}; 
    const updateCourseImageId = await courseModel.updateCourseImage(image.img_id, course_id);

    returnModel.code = Code.Created_Success;
    //returnModel.message = Message.Created_Success;
    //returnModel.data = image;
    return returnModel;
}

//#endregion

module.exports = {
    insertImage
}