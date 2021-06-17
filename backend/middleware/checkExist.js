const db = require("../models");
const Publication = db.publication;
const Comment = db.comment;
const User = db.user;

exports.publication = (req, res, next) => {
  Publication.findByPk(req.params.id)
    .then(publication => {
      if (publication == null) {
        res.status(404).send({ message: "Cette publication n'existe pas !" });
        return res.end();
      }
      next()
    })
};

exports.comment = (req, res, next) => {
  Comment.findByPk(req.params.id)
    .then(comment => {
      if (comment == null) {
        res.status(404).send({ message: "Ce commentaire n'existe pas !" });
        return res.end();
      }
      next()
    })
};

exports.user = (req, res, next) => {
  User.findOne({ where: { pseudo: req.body.pseudo }})
    .then(user => {
      if (user) {
        res.status(400).send({ message: "Nom d'utilisateur déjà utilisé" });
        return res.end();
      }
      User.findOne({
        where: {
          email: req.body.email
        }
      }).then(user => {
        if (user) {
          res.status(400).send({ message: "Email déjà utilisé." });
          return res.end();
        }
        next();
      });
    });
};