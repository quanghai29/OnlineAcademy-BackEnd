const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
// const fileUpload = require('express-fileupload');
require('express-async-errors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
// app.use(fileUpload());

// middleware api
require('./middlewares/routes.mdw')(app);

// middleware error
require('./middlewares/error.mdw')(app);

require('./chatbot');

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Online Academy backend is runing at ${process.env.HOST_NAME}:${process.env.PORT}`);
});
