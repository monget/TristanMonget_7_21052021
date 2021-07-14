const express = require('express');
const router = express.Router();

const publicationCrtl = require('../controllers/publications');
const multer = require('../middleware/multer-config');
const check = require('../middleware/checkExist');
const validator = require('../middleware/validator');
const auth = require('../middleware/auth');

router.post('/', auth, multer, validator.Publication, publicationCrtl.create);
router.put('/:id', auth, check.publication, multer, validator.Publication, publicationCrtl.modify);
router.delete('/:id', auth, check.publication, publicationCrtl.delete);
router.get('/:id', auth, check.publication, publicationCrtl.findOne);
router.get('/', publicationCrtl.findAll);
router.post('/:id/like', auth, check.publication, publicationCrtl.like);

module.exports = router;