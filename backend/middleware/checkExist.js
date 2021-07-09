const db = require("../models");
const userId = require("../utils/userId.js");
const Publication = db.publication;
const Comment = db.comment;
const User = db.user;
const fs = require('fs');

exports.publication = (req, res, next) => {
  if (req.baseUrl == "/api/comments" ) {
    Publication.findByPk(req.body.publicationId)
      .then(publication => {
        if (publication == null) {
          if (req.baseUrl == "/api/comments") {
            fs.unlinkSync(`images/comments/${req.file.filename}`)
          }
          res.status(404).send({ message: "Cette publication n'existe pas !" });
          return res.end();
        }
        next()
      })
  }
  else {
    Publication.findByPk(req.params.id)
    .then(publication => {
      if (publication == null) {
        res.status(404).send({ message: "Cette publication n'existe pas !" });
        return res.end();
      }
      next()
    })
  }
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
  if (req.method == "GET") {
    User.findByPk(req.params.id)
      .then(user => {
        if (user == null) {
          res.status(404).send({ message: "Ce profil n'existe pas !" });
          return res.end();
        }
        next()
      })
  }
  else {
    User.findOne({ where: { pseudo: req.body.pseudo }})
      .then(user => {
        if (req.method == "PUT") {
          if (user) {
            if (user.id == userId(req)) {
              User.findOne({ where: { email: req.body.email }})
                .then(user => {
                  if ((user == null) || (user.id == userId(req))) {
                    next();
                  }
                  else if (user) {
                    return res.status(400).json({ email: ["Email déjà utilisé"] });
                  }
                  else {
                    next();
                  }
                });
            }
            else {
              return res.status(400).json({ user: ["Nom d'utilisateur déjà utilisé"] });
            }
          }
          else {
            User.findOne({ where: { email: req.body.email }})
              .then(user => {
                if ((user == null) || (user.id == userId(req))) {
                  next();
                }
                else if (user) {
                  return res.status(400).json({ email: ["Email déjà utilisé"] });
                }
                else {
                  next();
                }
              });
          }
        }
        else if (user) {
          return res.status(400).json({ user: ["Nom d'utilisateur déjà utilisé"] });
        }
        else {
          User.findOne({ where: { email: req.body.email }})
          .then(user => {
            if (user) {
              return res.status(400).json({ email: ["Email déjà utilisé"] });
            }
            else {
              next();
            }
          });
        }
      });
  }
};