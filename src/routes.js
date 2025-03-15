const express = require('express');
const { registerAccount, loginAccount } = require('./services/users');

const router = express.Router();

router.post('/register', registerAccount);
router.post('/login', loginAccount);

module.exports = router;
