const express = require('express');
const router = express.Router();

const commentCrtl = require('../controllers/comments');
const multer = require('../middleware/multer-config');
const check = require('../middleware/checkExist');
const validator = require('../middleware/validator');
const auth = require('../middleware/auth');

router.post('/', auth, multer, validator.Comment, check.publication, commentCrtl.create);
router.put('/:id', auth, check.comment, multer, validator.Comment, check.publication, commentCrtl.modify);
router.delete('/:id', auth, check.comment, commentCrtl.delete);
router.post('/:id/like', auth, check.comment, commentCrtl.like);

module.exports = router;