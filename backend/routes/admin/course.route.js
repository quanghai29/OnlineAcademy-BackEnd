const router = require('express').Router();
const courseService = require('../../services/course.service');

router.get('/', async (req, res)=>{
  const result = await courseService.getCoursesForAdmin();

  res.status(result.code).json(result.data);
})

router.patch('/lock/:id', async(req, res)=>{
  const course_id = req.params.id || 0;
  const result = await courseService.lockById(course_id);

  res.status(result.code).json(result.message);
})

router.patch('/unlock/:id', async(req, res)=>{
  const course_id = req.params.id || 0;
  const result = await courseService.unlockById(course_id);

  res.status(result.code).json(result.message);
})

module.exports = router;