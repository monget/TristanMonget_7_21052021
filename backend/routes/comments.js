const express = require('express');
const router = express.Router();

const commentCrtl = require('../controllers/comments');
const multer = require('../middleware/multer-config');
const check = require('../middleware/checkExist');
const validator = require('../middleware/validator');
const auth = require('../middleware/auth');

router.post('/', auth, multer,/* (req, res, next) => {req.body = JSON.parse(req.body.publication), next()}, validator.create,*/ commentCrtl.create);
router.put('/:id', auth, check.comment, multer,/* (req, res, next) => {if (req.file != undefined) {req.body = JSON.parse(req.body.publication)} next()}, validator.modify,*/ commentCrtl.modify);
router.delete('/:id', auth, check.comment, commentCrtl.delete);
router.get('/:id', auth, check.comment, commentCrtl.findOne);
router.get('/', auth, commentCrtl.findAll);
router.post('/:id/like', auth, check.comment, commentCrtl.like);

module.exports = router;