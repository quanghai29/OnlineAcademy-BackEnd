const router = require('express').Router();
const multer = require('multer');
const fs = require('fs-extra');
const imageService = require('../../services/image.service');

//#region TienDung

/**
 * @openapi
 *
 * /lecturer/image:
 *   post:
 *     description: add a image
 *     tags: [image]
 *     parameters:
 *       - in: path
 *     responses:
 *       201:
 *         description: successfully created image
 */

 const storage =  multer.diskStorage({
  filename: async function (req, file, cb) {
    console.log(req.body);
    console.log('hehe');
    // lấy course_id
    var {course_id, img_title} = req.body;

      //Tạo tên hình ảnh của khóa học
      var filename = course_id + '.png';

      //Thêm dữ liệu tên ảnh vào csdl
      var entityImageCourse= {
          img_title : img_title,
          img_sourse: `/img/course/${filename}`,
      };

      const resultImageCourse = await imageService.insertImage(entityImageCourse, course_id);
      console.log(resultImageCourse);

      cb(null, filename);
  },
  destination: './public/img/course/'
});

const upload = multer({ storage }).single('courseImage');

router.post('/', async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  // console.log(req.body);
  // console.log(req.files.file.name);

  upload(req, res, (err) => {
    if(err) {
      res.status(401).json({message: err.message});
    }
    console.log(req);
    res.json({ fileName: 'add success' });
  })
});

//#endregion

module.exports = router;
