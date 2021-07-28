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

 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/public/img/course/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})


const upload = multer({ storage })

router.post('/', upload.single('file'), async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  res.status(200).json({message: 'hehe'});
});

//#endregion

module.exports = router;

// router.post('/', async (req, res) => {
//   if (req.file === null) {
//     return res.status(400).json({ msg: 'No file uploaded' });
//   }
//   console.log(req.body);
//   // console.log(req.files.file.name);
//   console.log(req.file);

//   upload(req, res, (err) => {
//     if(err) {
//       res.status(401).json({message: err.message});
//     }
//     res.json({ fileName: 'add success' });
//   })
// });

// const storage =  multer.diskStorage({
//   filename: async function (req, file, cb) {
//     console.log(req.body);
//     console.log('hehe');
//     // lấy course_id
//     var {course_id, img_title} = req.body;

//       //Tạo tên hình ảnh của khóa học
//       var filename = course_id + '.png';

//       //Thêm dữ liệu tên ảnh vào csdl
//       var entityImageCourse= {
//           img_title : img_title,
//           img_sourse: `/img/course/${filename}`,
//       };

//       const resultImageCourse = await imageService.insertImage(entityImageCourse, course_id);
//       console.log(resultImageCourse);

//       cb(null, filename);
//   },
//   destination: './public/img/course/'
// });