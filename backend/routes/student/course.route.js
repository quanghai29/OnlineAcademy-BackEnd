const router = require('express').Router();
const studentService = require('../../services/student.service');

//#region QuangHai
/**
 * @openapi
 *
 * /student/course/learning/{courseId}:
 *   get:
 *     description: get course learning
 *     tags: [Student]
 *     parameters:
 *        - in: path
 *          name: courseId
 *          schema:
 *            type: integer
 *            default: 1
 *          required: true
 *     responses:
 *       200:
 *         description: json data if sucess
 */
router.get('/learning/:courseId', async function (req, res) {

   //làm tạm accessToken để test
  req.accessTokenPayload = {
    userId: 1,
    role: 1
  }

  const student_id = req.accessTokenPayload.userId;
  const course_id = req.params.courseId;
  
  const ret = await studentService.getCourseLearning(student_id,course_id)
  res.status(ret.code).json(ret.data);
});

/**
 * @openapi
 *
 * /student/course/learning/{courseId}:
 *   post:
 *     description: get course learning
 *     tags: [Student]
 *     parameters:
 *        - in: path
 *          name: courseId
 *          schema:
 *            type: integer
 *            default: 1
 *          required: true
 *     responses:
 *       200:
 *         description: json data if sucess
 */
 router.post('/learning/:courseId', async function (req, res) {
   //làm tạm accessToken để test
   req.accessTokenPayload = {
    userId: 1,
    role: 1
  }

  const student_id = req.accessTokenPayload.userId;  
  const course_id = req.params.courseId;
  
  const ret = await studentService.registerCourse(student_id,course_id)
  res.status(ret.code).json(ret.data);
});


/**
 * @openapi
 *
 * none:
 *   post:
 *     description: get course learning
 *     tags: []
 *     requestBody:
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *              student_id:
 *                type: integer
 *                default: 1
 *              course_id:
 *                type: integer
 *                default: 1
 *           encoding:
 *     responses:
 *       200:
 *         description: json data if sucess
 */


//#endregion

module.exports = router;
