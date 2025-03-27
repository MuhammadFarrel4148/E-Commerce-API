const express = require('express');
const { registerAccount, loginAccount, forgotPasswordSendEmail, forgotPasswordInputOTP, AccessValidation, changePassword, logoutAccount } = require('./services/users');
const { addProduct, removeProduct, viewProduct } = require('./services/product');

const router = express.Router();

router.post('/register', registerAccount);
router.post('/login', loginAccount);
router.post('/sendemail', forgotPasswordSendEmail);
router.post('/inputotp', forgotPasswordInputOTP);
router.put('/changepassword', AccessValidation, changePassword);
router.post('/logout', logoutAccount);
router.post('/add/:idProduct', AccessValidation, addProduct);
router.delete('/remove/:idCart', AccessValidation, removeProduct);
router.get('/product', AccessValidation, viewProduct);

module.exports = router;
