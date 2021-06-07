const db = require("../models");
const User = db.user;

module.exports = (req, res, next) => {
  User.findOne({
    where: {
      pseudo: req.body.pseudo
    }
  })
  .then(user => {
    if (user) {
      res.writeHead( 400, "Erreur ! Nom d'utilisateur déjà utilisé", {'content-type' : 'text/plain'});
      return res.end();
    }
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.writeHead( 400, "Erreur ! Email déjà utilisé.", {'content-type' : 'text/plain'});
        return res.end();
      }
      next();
    });
  });
};