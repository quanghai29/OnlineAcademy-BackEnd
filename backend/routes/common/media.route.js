const router = require('express').Router();
const path = require('path');
const fs = require('fs');

//#region QuangHai

/**
 * @openapi
 * 
 * /common/media/image?path:
 *   get:
 *     description: display image
 *     tags: [Common]
 *     parameters:
 *       - in: path
 *         name: path   # Note the name is the same as in the path
 *         required: true
 *         schema:
 *           type: string
 *           default: /img/course/1/Trieu-Lo-Tu-Co-Trang.png
 *     responses:
 *       200:
 *         description: image display
 */
router.get('/image/', function (req, res) {
  const img_path = req.query.path || '/img/course/1/Trieu-Lo-Tu-Co-Trang.png';
  res.sendFile(path.join(__dirname, '../../public' + img_path));
})


/**
 * @openapi
 * 
 * /common/media/load_video/:id_video:
 *   get:
 *     description: Load Video
 *     tags: [Common]
 *     parameters:
 *       - in: id_video
 *         name: id_video   # Note the name is the same as in the path
 *         required: true
 *         schema:
 *           type: int
 *           default: 1
 *     responses:
 *       200:
 *         description: load video
 */
router.get('/load_video/:id_video', function (req, res) {
  const id_video = req.params.id_video || 1;
  //res.sendFile(path.join(__dirname, `../../public/videos/${id_video}.mp4`));
  const videoPath = path.join(__dirname, `../../public/videos/${id_video}.mp4`);
  const videoStat = fs.statSync(videoPath);
  const fileSize = videoStat.size;
  const videoRange = req.headers.range;
  if (videoRange) {
    const parts = videoRange.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
})
//#endregion

//#region 
//#endregion




module.exports = router;