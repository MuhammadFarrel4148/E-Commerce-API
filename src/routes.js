const express = require('express');
const { registerAccount, loginAccount, forgotPasswordSendEmail, forgotPasswordInputOTP, AccessValidation, changePassword, logoutAccount } = require('./services/users');

const router = express.Router();

router.post('/register', registerAccount);
router.post('/login', loginAccount);
router.post('/sendemail', forgotPasswordSendEmail);
router.post('/inputotp', forgotPasswordInputOTP);
router.post('/changepassword', AccessValidation, changePassword);
router.post('/logout', logoutAccount);

module.exports = router;
