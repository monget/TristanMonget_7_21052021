const db = require("../models");
const User = db.user;
const userId = require("../utils/userId.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require("../models/user");
require('dotenv').config()

exports.signup = (req, res, next) => {
  User.create({
    pseudo: req.body.pseudo,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  })
    .then(() => {
      User.findOne({ where: { pseudo: req.body.pseudo }})
        .then(user => {
          res.status(200).json({
            Id: user.id,
            pseudo: user.pseudo,
            email: user.email,
            token: jwt.sign(
                { userId: user.id},
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            ),
          })
        })
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.login = (req, res, next) => {
  User.findOne({ where: { pseudo: req.body.pseudo }})
    .then(user => {
      if (!user) {
        res.status(404).send({ message: "Erreur de nom d'utilisateur ou de mot de passe!" });
        return res.end();
      }

      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        res.status(404).send({ message: "Erreur de nom d'utilisateur ou de mot de passe!" });
        return res.end();
      }
      res.status(200).json({
        Id: user.id,
        pseudo: user.pseudo,
        email: user.email,
        token: jwt.sign(
            { userId: user.id},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        ),
      })
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.getUser = (req, res, next) => {
  User.findByPk(req.params.id)
    .then(users => {
      if (users.dataValues.id === userId(req)) {
        res.status(200).json(users)
      }
      else {
        const user = {
          id: users.dataValues.id,
          pseudo: users.dataValues.pseudo,
          email: users.dataValues.email,
          createdAt: users.dataValues.createdAt,
          updatedAt: users.dataValues.updatedAt
        }
        res.status(200).json(user)
      }
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.editProfil = (req, res, next) => {
  User.findByPk(req.params.id)
    .then(user => {
      if (user.id == userId(req)) {
        User.update({
          pseudo: req.body.pseudo,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10)
        },
        { where: { id: req.params.id }})
          .then(() => res.status(200).json({ message: 'Profil modifié !'}))
          .catch(err => res.status(500).send({ message: err.message }));
      }
      else {
        return res.status(400).json({ message: "Opération interdite !"})
      }
    })
};

exports.deleteProfil = (req, res, next) => {
  User.findByPk(req.params.id)
    .then(user => {
      if (user.id == userId(req)) {
        User.destroy({ where: { id: req.params.id }})
          .then(() => res.status(200).json({ message: 'Profil supprimé !'}))
          .catch(err => res.status(500).send({ message: err.message }));
      }
      else {
        return res.status(400).json({ message: "Opération interdite !"})
      }
    })
};