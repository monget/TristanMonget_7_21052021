const db = require("../models");
const User = db.user;
const userId = require("../utils/userId.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config()

exports.signup = (req, res, next) => {
  User.create({
    pseudo: req.body.pseudo,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    attachement: `${req.protocol}://${req.get('host')}/images/users/avatarDefault.svg`,
  })
    .then(() => {
      User.findOne({ where: { pseudo: req.body.pseudo }})
        .then(user => {
          res.status(200).json({
            Id: user.id,
            pseudo: user.pseudo,
            email: user.email,
            avatar: user.attachement,
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
        avatar: user.attachement,
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
        const user = {
          id: users.dataValues.id,
          pseudo: users.dataValues.pseudo,
          email: users.dataValues.email,
          avatar: users.dataValues.attachement,
          birthday: users.dataValues.birthday,
          createdAt: users.dataValues.createdAt,
          updatedAt: users.dataValues.updatedAt
        }
        res.status(200).json(user)
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.editProfil = (req, res, next) => {
  const userObject = req.file ?
  {
    ...req.body,
    attachement: `${req.protocol}://${req.get('host')}/images/users/${req.file.filename}`
  } : { ...req.body }
  User.findByPk(req.params.id)
    .then(user => {
      if (user.id == userId(req)) {
        if (req.file != undefined) {
					if (user.attachement != null) {
						const filename = user.attachement.split('/images/users/')[1];
            if (filename != "avatarDefault.svg") {
              fs.unlinkSync(`images/users/${filename}`)
            }
					}
				}
        User.update( userObject, { where: { id: req.params.id }})
          .then(() => res.status(200).json( userObject ))
          .catch(err => res.status(500).send({ message: err.message }));
      }
      else {
        return res.status(400).json({ message: "Opération interdite !"})
      }
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteProfil = (req, res, next) => {
  User.findByPk(req.params.id)
    .then(user => {
      if (user.id == userId(req)) {
        if (user.attachement != null) {
					const filename = user.attachement.split('/images/users/')[1];
          if (filename != "avatarDefault.svg") {
            fs.unlinkSync(`images/users/${filename}`)
          }
				}
        User.destroy({ where: { id: req.params.id }})
          .then(() => res.status(200).json({ message: 'Profil supprimé !'}))
          .catch(err => res.status(500).send({ message: err.message }));
      }
      else {
        return res.status(400).json({ message: "Opération interdite !"})
      }
    })
};