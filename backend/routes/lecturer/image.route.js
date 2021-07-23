const router = require('express').Router();
const multer = require('multer');
const fs = require('fs-extra');
// const imageService = require('../../services/image.service');

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
  filename: async function (req, files, cb) {

    // lấy course_id
    var course_id = req.body.course_id;

      //Tạo tên duy nhất
      var filename = course_id + '.png';

      //Thêm dữ liệu tên ảnh vào csdl
      var entityImageProduct= {
          ProID : id,
          imgURL: filename,
      };

       //thêm vào  proimage
      const resultsImageProduct = await productModel.addImageProduct(entityImageProduct);
      console.log(resultsImageProduct);

      cb(null, filename);
  },
  destination: function (req, file, cb) {
    //Lấy mã sản phẩm trên đường dẫn
    var id = req.params.id;
    //tạo folder cho image
    var dir = `./Contents/Images/${id}/`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
});



router.post('/', async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  const file = req.files.file;
  console.log(file.name);
  console.log(req.body);
  res.json({ fileName: file.name });
});

//#endregion

module.exports = router;
