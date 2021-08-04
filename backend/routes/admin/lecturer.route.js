const router = require('express').Router();
const lecturerService =  require('../../services/lecturer.service')

router.get('/', async(req, res)=>{
  const resData = await lecturerService.getLecturers();

  res.status(resData.code).json(resData.data);
})

module.exports = router;