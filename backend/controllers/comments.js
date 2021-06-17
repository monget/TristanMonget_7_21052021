const db = require("../models");
const userId = require("../utils/userId.js")
const Comment = db.comment;
const fs = require('fs');

exports.create = (req, res, next) => {
  Comment.create({
    pseudo: req.body.pseudo,
		message: req.body.message,
    attachement: req.body.attachement, //`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
		like: 0,
		publicationId: req.body.publicationId,
		userId: userId(req)
  })
    .then(() => res.status(201).json({ message: 'Commentaire ajouté !' }))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.modify = (req, res, next) => {
	/*const commentObject = req.file ? // Contrôle si req.file existe
	{ 
		...req.body,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	} : { ...req.body };*/
	Comment.update(req.body, { where: { id: req.params.id }})
		.then(() => res.status(200).json({ message: 'Commentaire modifié !' }))
		.catch(err => res.status(400).send({ message: err.message }));
};

exports.delete = (req, res, next) => {
	Comment.destroy({	where: { id: req.params.id }})
		.then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
		.catch(err => res.status(400).send({ message: err.message }));
};

exports.findOne = (req, res, next) => {
  Comment.findByPk(req.params.id)
		.then(comment => res.status(200).json(comment))
		.catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res, next) => {
	Comment.findAll()
		.then(comments => res.status(200).json(comments))
		.catch(err =>	res.status(400).send({ message: err.message }));
};

exports.like = (req, res, next) => {
	counter = req.body.like;
	Comment.findByPk(req.params.id)
		.then(comment => {
			if (counter === 1) {
				comment.increment({ like: 1 }, { where: { id: req.params.id }})
					.then(() => res.status(200).json({ message: 'J\'aime !' }))
					.catch(err => res.status(400).send({ message: err.message }));
			}
			else if (counter === 0) {
				comment.increment({ like: -1 }, {	where: { id: req.params.id }})
					.then(() => res.status(200).json({ message: 'J\'aime annulé' }))
					.catch(err => res.status(400).send({ message: err.message }));
			}
		})
		.catch(err => res.status(404).send({ message: err.message }));
};
