const router = require('express').Router();
const multer = require('multer');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const chapterService = require('../../services/chapter.service');
//#region TienDung

/**
 * @openapi
 *
 * /lecturer/video:
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
    const filename = uuidv4() + '.mp4' ;
    req.video_source = filename;
    cb(null, filename);
  },
  destination: function(req, file, cb){
    var dir = `./public/videos`;
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
    cb(null, dir);
  },
});

const upload = multer({ storage });

router.post('/', (req, res) => {
  if (req.file === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  upload.single('video')( req,res, async err =>{
    if(err) {
      console.log(err);
      return res.status(400).end();
    }

    const entityVideo = {
      chapter_id: req.body.chapter_id,
      title: req.body.title,
      duration: req.body.duration,
      source: req.video_source
    };

    //xử lý insert vào db
    const ret = await chapterService.insertVideo(entityVideo);

    res.status(ret.code).json(ret.data);
  })
  
});

//#endregion

module.exports = router;
