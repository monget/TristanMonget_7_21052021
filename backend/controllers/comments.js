const db = require("../models");
const userId = require("../utils/userId.js")
const Comment = db.comment;
const fs = require('fs');

exports.create = (req, res, next) => {
  Comment.create({
		message: req.body.message,
    attachement: `${req.protocol}://${req.get('host')}/images/comments/${req.file.filename}`,
		like: 0,
		publicationId: req.body.publicationId,
		userId: userId(req)
  })
    .then(() => res.status(201).json({ message: 'Commentaire ajouté !' }))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.modify = (req, res, next) => {
	const commentObject = req.file ? // Contrôle si req.file existe
	{ 
		...req.body,
		attachement: `${req.protocol}://${req.get('host')}/images/comments/${req.file.filename}`
	} : { ...req.body }
	Comment.findOne({ where: { id: req.params.id }})
	.then(comment => {
		if (comment.userId == userId(req)) {
			if (req.file != undefined) {
				const filename = comment.attachement.split('/images/comments/')[1];
				fs.unlinkSync(`images/comments/${filename}`)
			}
			Comment.update( commentObject, { where: { id: req.params.id }})
				.then(() => res.status(200).json({ message: 'Commentaire modifiée !' }))
				.catch(err => res.status(400).json({ message: err.message }));		
		}
		else {
			return res.status(400).json({ message: "Opération interdite !" });
		}
	})
	.catch(error => res.status(400).json({ error }));
};

exports.delete = (req, res, next) => {
	Comment.findOne({ where: { id: req.params.id }})
		.then(comment => {
			if (comment.userId == userId(req)) {
				const filename = comment.attachement.split('/images/comments/')[1];
				if (filename != undefined) {
					fs.unlinkSync(`images/comments/${filename}`)
				}
				Comment.destroy({	where: { id: req.params.id }})
					.then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
					.catch(err => res.status(400).send({ message: err.message }));
			}
			else {
				return res.status(400).json({ message: "Opération interdite !" });
			}
		})
		.catch(error => res.status(400).json({ error }));
};

exports.findOne = (req, res, next) => {
  Comment.findByPk(req.params.id, {	attributes: { exclude: ['updatedAt'] } })
		.then(comment => res.status(200).json(comment))
		.catch(err => res.status(500).send({ message: err.message }));
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
