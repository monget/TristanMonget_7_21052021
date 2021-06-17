const jwt = require('jsonwebtoken');
const db = require("../models");
const User = db.user;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    User.findOne({ where: { id: userId }})
      .then(user => {
        if (!user) {
          throw 'User ID non valable';
        }
        else {
          next();
        }
      })
      .catch(error => res.status(401).json({ error }))
    }
  catch (error) {
    res.status(401).json({ error: 'Requête non authentifié !' })
  }
}