const express = require('express');
const { registerAccount, loginAccount, forgotPasswordSendEmail, forgotPasswordInputOTP } = require('./services/users');

const router = express.Router();

router.post('/register', registerAccount);
router.post('/login', loginAccount);
router.post('/sendemail', forgotPasswordSendEmail);
router.post('/inputotp', forgotPasswordInputOTP);

module.exports = router;
