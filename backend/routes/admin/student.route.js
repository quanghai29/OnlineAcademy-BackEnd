const router = require('express').Router();
const studentService = require('../../services/student.service');

router.get('/', async(req, res)=>{
  const resData = await studentService.getStudents();
  res.status(resData.code).json(resData.data);
})

router.patch('/lock/:id', async (req, res)=>{
  const id = req.params.id || 0;
  const resData = await studentService.lockItemById(id);

  res.status(resData.code).json(resData.data);
})

router.patch('/unlock/:id', async (req, res)=>{
  const id = req.params.id || 0;
  const resData = await studentService.unlockItemById(id);

  res.status(resData.code).json(resData.data);
})
module.exports = router;