const db = require("../models");
const Publication = db.publication;

module.exports = (req, res, next) => {
  Publication.findByPk(req.params.id)
    .then(publication => {
      if (publication == null) {
        res.status(404).send({ message: "Cette publication n'existe pas !" });
        return res.end();
      }
      next()
    })
};