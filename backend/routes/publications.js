const express = require('express');
const router = express.Router();

const publicationCrtl = require('../controllers/publications');
const multer = require('../middleware/multer-config');
const check = require('../middleware/checkExist');
const validator = require('../middleware/validator');
const auth = require('../middleware/auth');

router.post('/', auth, multer,/* (req, res, next) => {req.body = JSON.parse(req.body.publication), next()}, validator.create,*/ publicationCrtl.create);
router.put('/:id', auth, check.publication, multer,/* (req, res, next) => {if (req.file != undefined) {req.body = JSON.parse(req.body.publication)} next()}, validator.modify,*/ publicationCrtl.modify);
router.delete('/:id', auth, check.publication, publicationCrtl.delete);
router.get('/:id', auth, check.publication, publicationCrtl.findOne);
router.get('/', auth, publicationCrtl.findAll);
router.post('/:id/like', auth, check.publication, publicationCrtl.like);

module.exports = router;