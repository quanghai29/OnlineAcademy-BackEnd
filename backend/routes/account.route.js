const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const accountService = require('../services/account.service');

const signupSchema = require('../schema/account/signup.account.json')
router.post('/signup', require('../middlewares/validate.mdw')(signupSchema),
  async (req, res) => {
    const newAcc = req.body;
    const checkUsername = await accountService.checkExistedUsername(newAcc.username);
    const checkEmail = await accountService.checkExistedEmail(newAcc.email);
    if (checkUsername.isExistedUsername) {
      res.json(checkUsername);
    } else if(checkEmail.isExistedEmail){
      res.json(checkEmail);
    }else {
      newAcc.password = bcrypt.hashSync(newAcc.password, 10);
      const ret = await accountService.createAcc(newAcc);
      delete newAcc.password;

      //send OTP-code by email
      const otpCode = accountService.generateCode();
      const otpToken = jwt.sign({
        otpCode,
        id: ret.data.id
      }, process.env.JWT_TOKEN, {
        expiresIn: process.env.OTP_EXPIRES_IN // seconds
      });
      accountService.sendOtpCodeByEmail(req.body.email, otpCode);

      ret.otpToken = otpToken;
      res.status(ret.code).json(ret);
    }

  })

const verifyCodeSchema = require('../schema/account/verifyCode.account.json');
const validateCodeSchema = require('../middlewares/validate.mdw')(verifyCodeSchema);
const authMiddleware = require('../middlewares/auth.mdw');
router.post('/verify-code', authMiddleware, validateCodeSchema,
  async (req, res) => {
    const code = req.body.code;
    const tokenPayload = req.accessTokenPayload;
    if (code === tokenPayload.otpCode) {
      //active email

      const result = await accountService.activeEmail(tokenPayload.id);
      res.status(result.code).json(result);
    } else {
      res.status(440).json({
        message: 'The otp-code is not correct!'
      });
    }
  })

router.post('/resend-code', async (req, res) => {
  const email = req.body.email;
  const result = await accountService.getAccountByEmail(email);
  if (result.code === 200) {
    const otpCode = accountService.generateCode();
    const otpToken = jwt.sign({
      otpCode,
      id: result.data.id
    }, process.env.JWT_TOKEN, {
      expiresIn: process.env.OTP_EXPIRES_IN // seconds
    });
    accountService.sendOtpCodeByEmail(email, otpCode);

    res.status(200).json({
      ...result,
      otpToken
    });
  } else {
    return res.status(404).json({
      message: 'Email is not found'
    });
  }

})

module.exports = router;