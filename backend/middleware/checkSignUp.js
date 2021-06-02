const db = require("../models");
const User = db.user;

module.exports = (req, res, next) => {
  User.findOne({ // Username
    where: {
      pseudo: req.body.pseudo
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Erreur ! Nom d'utilisateur déjà utilisé."
      });
      return;
    }
    User.findOne({ // Email
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Erreur ! Email déjà utilisé."
        });
        return;
      }
      next();
    });
  });
};

/*
checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({ // Username
    where: {
      pseudo: req.body.pseudo
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Erreur ! Nom d'utilisateur déjà utilisé."
      });
      return;
    }
    User.findOne({ // Email
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Erreur ! Email déjà utilisé."
        });
        return;
      }
      next();
    });
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
*/