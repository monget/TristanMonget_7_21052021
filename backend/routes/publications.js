const express = require('express');
const router = express.Router();

const publicationCrtl = require('../controllers/publications');
const multer = require('../middleware/multer-config');
const validator = require('../middleware/validator');
const auth = require('../middleware/auth');

router.post('/',/* auth,*/ multer,/* (req, res, next) => {req.body = JSON.parse(req.body.sauce), next()}, validator.createSauce,*/ publicationCrtl.create);
router.put('/:id',/* auth, multer, (req, res, next) => {if (req.file != undefined) {req.body = JSON.parse(req.body.sauce)} next()}, validator.modifySauce,*/ publicationCrtl.modify);
router.delete('/:id',/* auth,*/ publicationCrtl.delete);
router.get('/:id',/* auth,*/ publicationCrtl.findOne);
router.get('/',/* auth,*/ publicationCrtl.findAll);
router.post('/:id/like',/* auth,*/ publicationCrtl.like);

module.exports = router;