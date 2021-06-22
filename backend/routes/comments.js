const express = require('express');
const router = express.Router();

const commentCrtl = require('../controllers/comments');
const multer = require('../middleware/multer-config');
const check = require('../middleware/checkExist');
const validator = require('../middleware/validator');
const auth = require('../middleware/auth');

router.post('/', auth, multer, validator.createComment, commentCrtl.create);
router.put('/:id', auth, check.comment, multer, validator.modifyComment, commentCrtl.modify);
router.delete('/:id', auth, check.comment, commentCrtl.delete);
router.get('/:id', auth, check.comment, commentCrtl.findOne);
router.post('/:id/like', auth, check.comment, commentCrtl.like);

module.exports = router;