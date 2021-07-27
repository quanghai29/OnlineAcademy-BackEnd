const router = require('express').Router();
const courseService = require('../services/course.service');

//#region Mai Linh Đồng

/**
 * @openapi
 * paths:
 *  /course?category_id={category_id}:
 *    get:
 *      description: get all of courses which has category_id = number
 *      tags: [Course]
 *      parameters:
 *          - in: query
 *            name: category_id
 *            schema:
 *              type: integer
 *              minimum: 1
 *            required: true
 *      responses:
 *          200:
 *              description: json data
 *          400:
 *              description: bad request
 */
router.get('/', async (req, res) => {
  const category_id = +req.query.category_id || 0;
  const ret = await courseService.getCourseByCategory(category_id);
  res.status(ret.code).json(ret);
});

/**
 * @openapi
 *  
 * /course/search:
 *  post:
 *      description: find courses which concerning key words
 *      tags: [Course]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema: {}
 *                  example:
 *                      text_search: value
 *                      
 *      responses:
 *          200:
 *              description: json data
 *          400: 
 *              description: bad request in case have not any text is sent to server
 */
router.post('/search', async (req, res) => {
  const text = req.body.text_search || "";
  const ret = await courseService.findCourse(text);
  res.status(ret.code).json(ret);
});

/**
 * @openapi
 * 
 * /course/outstanding:
 *  post:
 *      description: find outstanding courses(by vote)
 *      tags: [Course]
 *      responses:
 *          200:
 *              description: json data
 */
router.post('/outstanding', async (req, res)=>{
    const ret = await courseService.getOutstandingCourses();
    res.status(ret.code).json(ret);
})

// ================= get coments of a course =============
/**
 * @openapi
 * /course/comments/{id}:
 *  get:
 *    description: get all of comments of a course
 *    tags: [Course]
 *    parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *             type: integer
 *             minimum: 1
 *             default: 1
 * 
 *    responses:
 *       200: 
 *          description: json data
 */
router.get('/comments/:id', async function(req, res){
  const course_id = +req.params.id || 0;
  const ret = await courseService.getCommentsOfCourse(course_id);
  
  res.status(ret.code).json(ret.data);
})

/**
 * @openapi
 * 
 * /course/comment:
 *  post:
 *    description: insert a course's comment
 *    tags: [Course]
 *    requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  {}
 *                 
 *              example:
 *                  {content: 'content of comment',
 *                   student_id: 1,
 *                    course_id: 1
 *                  }
 *    responses:
 *      201:
 *        description: Create comment successfully
 *      401: 
 *        description: Create comment unsuccessfully
 */
const commentSchema = require('../schema/comment.json');
router.post('/comment', require('../middlewares/validate.mdw')(commentSchema) 
,async function(req,res){
  const comment = req.body;
  const result = await courseService.addComment(comment);

  res.status(result.code).json(result);
})

//#endregion

//#region TienDung

/**
 * @openapi
 *
 * /course/10-latest:
 *  get:
 *      description: get 10 latest courses
 *      tags: [Course]
 *      parameters:
 *
 *      responses:
 *          200:
 *              description: json data
 */

router.get('/10-latest', async (req, res) => {
  const ret = await courseService.getLatestCourses(10);
  res.status(ret.code).json(ret.data);
});

/**
 * @openapi
 *
 * /course/10-latest:
 *  get:
 *      description: get 10 latest courses
 *      tags: [Course]
 *      parameters:
 *
 *      responses:
 *          200:
 *              description: json data
 */

router.get('/10-mostview', async (req, res) => {
  const ret = await courseService.getMostViewCourses(10);
  res.status(ret.code).json(ret.data);
});

/**
 * @openapi
 *
 * /course/5-bestseller:
 *  get:
 *      description: get 5 best seller by category
 *      tags: [Course]
 *      parameters:
 *
 *      responses:
 *          200:
 *              description: json data
 */

router.get('/5-bestseller', async (req, res) => {
  const ret = await courseService.getBestSellerCoursesByCategory(1, 10);
  res.status(ret.code).json(ret.data);
});

//#endregion

//#region QuangHai

/**
 * @openapi
 *
 * /course/{id}:
 *   get:
 *     description: get detail course
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id   # Note the name is the same as in the path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *     responses:
 *       200:
 *         description: json data if sucess
 */
router.get('/:id', async function (req, res) {
  const id = req.params.id || 0;
  const ret = await courseService.getCourseDetail(id);
  res.status(ret.code).json(ret.data);
});

//#endregion

module.exports = router;
