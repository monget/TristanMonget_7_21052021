const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/users');
const validator = require('../middleware/validator');
const check = require('../middleware/checkExist');
const accountLimit = require('../middleware/accountLimiter');
const auth = require('../middleware/auth');

router.post('/signup', accountLimit, check.user, validator.signup, userCtrl.signup);
router.post('/login', accountLimit, userCtrl.login);
router.get('/profil/:id', auth, check.user, userCtrl.getUser);
router.put('/profil/:id', auth, validator.signup, check.user, userCtrl.editProfil);
router.delete('/profil/:id', auth, userCtrl.deleteProfil);

module.exports = router;