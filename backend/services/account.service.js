const accountModel = require('../models/account.model');
const { Code, Message } = require('../helper/statusCode.helper');
const nodemailer = require('nodemailer');
const rn = require('random-number');

async function createAcc(newAcc) {
  const result = {};
  const acc = await accountModel.addAccount(newAcc);
  newAcc.id = acc[0];
  newAcc.password = null;
  result.code = Code.Created_Success;
  result.message = Message.Created_Success;
  result.isExist = false;
  result.data = newAcc;
  return result;
}

async function checkExistingAccount(username) {
  let result = {};
  const account = await accountModel.getSingleAccountByUsername(username);
  result.isExist = account ? true : false;
  result.code = Code.Success;

  return result;
}

function sendOtpCodeByEmail(destinationEmail, content) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'gel1999academy@gmail.com',
      pass: 'hoaroicuaphat2468'
    }
  });

  const mailOptions = {
    from: 'gel1999academy@gmail.com',
    to: destinationEmail,
    subject: 'OTP-code',
    text: `${content}`
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      return info.response
    }
  });
}

function generateCode(){
  const gen = rn.generator({
    min:  100000
  , max:  1000000
  , integer: true
  });
  return gen();
}

async function activeEmail(accountId){
  const resData ={};
  const result = await accountModel.activeEmail(accountId);
  resData.result = result;
  resData.code = Code.Success;
  resData.message = Message.Success

  return resData;
}

async function getAccountByEmail(email){
  const res ={};
  const result = await accountModel.getSingleAccountByEmail(email);
  if(result === null){
    res.code = Code.Not_Found
  }else{
    res.code = Code.Success;
    res.data = result
  }

  return res;
}

async function loginAcc(data) {
}

//#region TienDung

async function getAccountByUsername(username) {
  const returnModel = {};
  const account = await accountModel.getSingleAccountByUsername(username);
  if(account === null) {
    returnModel.code = Code.Not_Found;
  } else {
    returnModel.code = Code.Success;
    returnModel.data = account;
  }
  return returnModel;
}

async function updateRefreshToken(id, refreshToken) {
  const returnModel = {};
  const ret = await accountModel.updateRefreshToken(id, refreshToken);
  if (ret) {
    returnModel.code = Code.Success;
    returnModel.data = ret;
  }
  return returnModel;
}

async function isValidRefreshToken(id, refreshToken) {
  const returnModel = {};
  const ret = await accountModel.isValidRefreshToken(id, refreshToken);
  if (ret) {
    returnModel.code = Code.Success;
    returnModel.data = ret;
  } else {
    returnModel.code = Code.Not_Found;
    returnModel.data = ret;
  }
  return returnModel;
}

//#endregion

module.exports = {
  createAcc, loginAcc, updateRefreshToken, isValidRefreshToken,
  checkExistingAccount, sendOtpCodeByEmail, generateCode, activeEmail,
  getAccountByUsername, getAccountByEmail
}