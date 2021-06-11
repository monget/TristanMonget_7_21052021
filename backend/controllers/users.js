const db = require("../models");
const User = db.user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

exports.signup = (req, res, next) => {
  User.create({
    pseudo: req.body.pseudo,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  })
    .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  };

exports.login = (req, res, next) => {
  User.findOne({
    where: {
      pseudo: req.body.pseudo
    }
  })
    .then(user => {
      if (!user) {
        res.writeHead( 404, "Erreur de nom d'utilisateur ou de mot de passe!", {'content-type' : 'text/plain'});
        return res.end();
      }

      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      
      if (!passwordIsValid) {
        res.writeHead( 404, "Erreur de nom d'utilisateur ou de mot de passe!",{'content-type' : 'text/plain'});
        return res.end();
      }
      res.status(200).json({
        Id: user.id,
        pseudo: user.pseudo,
        email: user.email,
        token: jwt.sign(
            { userId: user._id},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        ),
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  };