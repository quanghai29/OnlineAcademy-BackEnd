const router = require('express').Router();
const courseService = require('../../services/course.service');

//#region TienDung

/**
 * @openapi
 * 
 * /lecturer/course:
 *   post:
 *     description: add a course
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *     responses:
 *       201:
 *         description: successfully created course
 */ 
 const schema = require('../../schema/course.json');

 router.post('/', require('../../middlewares/validate.mdw')(schema), async (req, res) => {
     const newCourse = req.body;
     const ret = await courseService.insertCourse(newCourse);
     res.status(ret.code).json(ret.data);
 })
 
 //#endregion

 module.exports = router;