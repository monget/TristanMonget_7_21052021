const express = require('express');
const router = express.Router();

const publicationCrtl = require('../controllers/publications');
const multer = require('../middleware/multer-config');
const checkPublication = require('../middleware/checkPublication');
const validator = require('../middleware/validator');
const auth = require('../middleware/auth');

router.post('/',/* auth,*/ multer,/* (req, res, next) => {req.body = JSON.parse(req.body.publication), next()}, validator.create,*/ publicationCrtl.create);
router.put('/:id',/* auth,*/ checkPublication,/* multer, (req, res, next) => {if (req.file != undefined) {req.body = JSON.parse(req.body.publication)} next()}, validator.modify,*/ publicationCrtl.modify);
router.delete('/:id',/* auth,*/ checkPublication, publicationCrtl.delete);
router.get('/:id',/* auth,*/ checkPublication, publicationCrtl.findOne);
router.get('/',/* auth,*/ publicationCrtl.findAll);
router.post('/:id/like',/* auth,*/ checkPublication, publicationCrtl.like);

module.exports = router;