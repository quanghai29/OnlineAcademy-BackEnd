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
router.get('/course/learning/:courseId', async function (req, res) {
  const student_id = req.header.student_id || 1; //chơi tạm 
  const course_id = req.params.courseId;
  
  const ret = await studentService.getCourseLearning(student_id,course_id)
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
