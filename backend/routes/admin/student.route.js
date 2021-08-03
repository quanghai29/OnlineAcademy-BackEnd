const router = require('express').Router();
const studentService = require('../../services/student.service');

router.get('/', async(req, res)=>{
  const resData = await studentService.getStudentData();
  res.status(resData.code).json(resData.data);
})

router.delete('/', async (req, res)=>{
  const student_id = req.headers.student_id;
  const resData = await studentService.removeItemById(student_id);

  res.status(resData.code).json(resData.data);
})
module.exports = router;