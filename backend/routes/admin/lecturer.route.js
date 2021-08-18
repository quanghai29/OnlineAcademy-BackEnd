const router = require('express').Router();
const lecturerService =  require('../../services/lecturer.service')

router.get('/', async(req, res)=>{
  const resData = await lecturerService.getLecturers();

  res.status(resData.code).json(resData.data);
})

router.patch('/lock/:id', async (req, res)=>{
  const id = req.params.id || 0;
  const resData = await lecturerService.lockLecturer(id);

  res.status(resData.code).json(resData.data);
})

router.patch('/unlock/:id', async (req, res)=>{
  const id = req.params.id || 0;
  const resData = await lecturerService.unlockLecturer(id);

  res.status(resData.code).json(resData.data);
})

router.post('/', async (req, res)=>{
  const data = req.body;
  const resData = await lecturerService.addLecturerItem(data);

  res.status(resData.code).json(resData);
})
module.exports = router;