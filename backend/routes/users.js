const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/users');
const validator = require('../middleware/validator');
const check = require('../middleware/checkExist');
const accountLimit = require('../middleware/accountLimiter');

router.post('/signup', accountLimit, validator.signup, check.user, userCtrl.signup);
router.post('/login', accountLimit, userCtrl.login);

module.exports = router;