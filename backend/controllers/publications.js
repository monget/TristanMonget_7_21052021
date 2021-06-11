const db = require("../models");
const Publication = db.publication;
const fs = require('fs');
const jwt = require('jsonwebtoken');
const publication = require("../models/publication");

exports.create = (req, res, next) => {
  Publication.create({
    title: req.body.title,
		message: req.body.message,
    attachement: req.body.attachement, //`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
		like: 0
  })
    .then(() => res.status(201).json({ message: 'Publication créé !'}))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.modify = (req, res, next) => {
	/*const publicationObject = req.file ? // Contrôle si req.file existe
	{ 
		...req.body,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	} : { ...req.body };*/
	Publication.update(req.body, {	where: { id: req.params.id }})
		.then(() => res.status(200).json({ message: 'Publication modifiée !'}))
		.catch(err => res.status(400).send({ message: err.message }));

};

exports.delete = (req, res, next) => {
	Publication.destroy({	where: { id: req.params.id }})
		.then(() => res.status(200).json({ message: 'Objet supprimé !'}))
		.catch(err => res.status(400).send({ message: err.message }));
};

exports.findOne = (req, res, next) => {
  Publication.findByPk(req.params.id)
		.then(publication => res.status(200).json(publication))
		.catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res, next) => {
	Publication.findAll()
		.then(publications => res.status(200).json(publications))
		.catch(err =>	res.status(400).send({ message: err.message }));
};

exports.like = (req, res, next) => {
	counter = req.body.like;
	Publication.findByPk(req.params.id)
		.then(publication => {
			if (counter === 1) {
				publication.increment({ like: 1 }, {	where: { id: req.params.id }})
					.then(() => res.status(200).json({ message: 'J\'aime !'}))
					.catch(err => res.status(400).send({ message: err.message }));
			}
			else if (counter === 0) {
				publication.increment({ like: -1 }, {	where: { id: req.params.id }})
					.then(() => res.status(200).json({ message: 'J\'aime annulé'}))
					.catch(err => res.status(400).send({ message: err.message }));
			}
		})
		.catch(err => res.status(404).send({ message: err.message }));
};
