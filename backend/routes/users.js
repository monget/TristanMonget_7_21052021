const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/users');
const validator = require('../middleware/validator');
const checkSignUp = require('../middleware/checkSignUp');
const accountLimit = require('../middleware/accountLimiter');

router.post('/signup', accountLimit, validator.signup, checkSignUp, userCtrl.signup);
router.post('/login', accountLimit, userCtrl.login);

module.exports = router;