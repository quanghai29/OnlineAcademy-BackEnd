const swaggerUI = require('swagger-ui-express');
const {openapiSpecification} = require('../utils/swagger');
// const auth = require('./auth.mdw');

module.exports = function (app) {
  // link default
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello from Online Course API',
    });
  });

  // link api documents
  app.use("/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(openapiSpecification, { explorer: true }
  ));
  
  //routers path here
  app.use('/auth', require('../routes/auth.route'));
  app.use('/course', require('../routes/course.route'));
  app.use('/common/media', require('../routes/common/media.route'));
  app.use('/lecturer/course', require('../routes/lecturer/course.route'));
  app.use('/lecturer/chapter', require('../routes/lecturer/chapter.route'));
  app.use('/lecturer/image', require('../routes/lecturer/image.route'));
  app.use('/lecturer', require('../routes/lecturer.route'));
  app.use('/category',require('../routes/category.route'));
  app.use('/account', require('../routes/account.route'));
  app.use('/student', require('../routes/student/favorite_courses.route'));
  app.use('/student/watchlist', require('../routes/student/watchlist.route'));
};
