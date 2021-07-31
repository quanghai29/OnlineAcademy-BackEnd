const router = require('express').Router();
const categoryService = require("../../services/category.service")

router.get('/', async(req,res)=>{
  const result = await categoryService.getExpandedInfo();

  res.status(result.code).json(result);
})

module.exports = router;