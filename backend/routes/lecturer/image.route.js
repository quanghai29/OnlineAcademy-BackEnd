const router = require('express').Router();
const multer = require('multer');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const imageService = require('../../services/image.service');
const path = require('path');
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
  filename: async function (req, file, cb) {
    const filename = uuidv4() + '.png' ;
    req.img_source = filename;
    cb(null, filename);
  },
  destination: function(req, file, cb){
    var dir = `./public/img`;
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
    cb(null, dir);
  },
});

const upload = multer({ storage });

router.post('/', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  upload.single('img')( req,res, async err =>{
    //lấy tên file image
    const img_source = req.img_source;
    const course_id = req.body.course_id;
    

    const entityImageCourse = {
      img_title: req.body.img_title,
      img_source: img_source,
    };

    //xử lý insert vào db
    const ret = await imageService.insertImage(entityImageCourse, course_id);

    res.status(ret.code).end();
  })
  
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