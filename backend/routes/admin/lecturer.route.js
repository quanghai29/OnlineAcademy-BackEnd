const router = require('express').Router();
const lecturerService =  require('../../services/lecturer.service')

router.get('/', async(req, res)=>{
  const resData = await lecturerService.getLecturers();

  res.status(resData.code).json(resData.data);
})

router.delete('/', async (req, res)=>{
  const {lecturer_id} = req.headers;
  const resData = await lecturerService.removeItemById(lecturer_id);

  res.status(resData.code).json(resData.data);
})

router.post('/', async (req, res)=>{
  const data = req.body;
  const resData = await lecturerService.addLecturerItem(data);

  res.status(resData.code).json(resData);
})
module.exports = router;