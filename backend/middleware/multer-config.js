const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (req.baseUrl == "/api/comments") {
      callback(null, 'images/comments');
    }
    else if (req.baseUrl == "/api/auth") {
      callback(null, 'images/users');
    }
    else {
      callback(null, 'images/publications');
    }
  },
  filename: (req, file, callback) => { // Nom du fichier et contrôle de l'extension
    const originalName = file.originalname.split(' ').join('_');
    const name = originalName.split(".")[0];
    const extension = MIME_TYPES[file.mimetype];
    var fileTypes = /jpeg|jpg|png|gif/;
    var mimetype = fileTypes.test(file.mimetype);
    if (mimetype == true) {
      callback(null, name + Date.now() + '.' + extension);
    }
    else {
      callback(null, 'error')
    }
  }
});

module.exports = multer({storage: storage}).single('image');