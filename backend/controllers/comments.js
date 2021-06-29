const db = require("../models");
const userId = require("../utils/userId.js")
const Comment = db.comment;
const Like = db.like;
const fs = require('fs');

exports.create = (req, res, next) => {
  Comment.create({
		message: req.body.message,
    attachement: `${req.protocol}://${req.get('host')}/images/comments/${req.file.filename}`,
		like: 0,
		dislike: 0,
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
	Comment.findByPk(req.params.id, {	include: [{ model: Like, attributes: ['usersLiked', 'usersDisliked', 'userId', 'commentId'], required: false }] })
		.then(comment => {
			Like.findAll({ where: { commentId: req.params.id, userId: userId(req)}})
				.then(likes => {
					const arrayUserId = [];
					comment.likes.forEach(likes => {
						arrayUserId.push(likes.dataValues.userId)
					})
					if (arrayUserId.includes(userId(req))) {
						likes.forEach(like => {
							if (counter === 1) {
								if (like.dataValues.usersDisliked === true) {
									Like.update({ usersLiked: true, usersDisliked: false }, { where: { userId: userId(req), commentId: req.params.id }})
										.then(() => {
											comment.increment({ like: 1, dislike: 1 }, {	where: { id: req.params.id }})
												.then(() => res.status(200).json({ message: 'Finalement j\'aime ! !' }))
												.catch(err => res.status(400).send({ message: err.message }));
									})
								}
								else {
									res.status(400).json({ message: 'j\'aime déjà ce commentaire !' })
								}
							}
							else if (counter === 0) {
								if (like.dataValues.usersLiked === true) {
									Like.destroy({ where: { userId: userId(req), commentId: req.params.id }})
										.then(() => {
											comment.increment({ like: -1 }, { where: { id: req.params.id }})
												.then(() => res.status(200).json({ message: 'J\'aime annulé'}))
												.catch(error => res.status(400).json({ error }));
										})
								}
								else {
									Like.destroy({ where: { userId: userId(req), commentId: req.params.id }})
										.then(() => {
											comment.increment({ dislike: 1 }, { where: { id: req.params.id }})
												.then(() => res.status(200).json({ message: 'Je n\'aime pas annulé'}))
												.catch(error => res.status(400).json({ error }));
										})
								}
							}
							else if (counter === -1) {
								if (like.dataValues.usersLiked === true) {
									Like.update({ usersLiked: false, usersDisliked: true }, { where: { userId: userId(req), commentId: req.params.id }})
										.then(() => {
											comment.increment({ like: -1, dislike: -1 }, {	where: { id: req.params.id }})
												.then(() => res.status(200).json({ message: 'Je n\'aime plus !' }))
												.catch(err => res.status(400).send({ message: err.message }));
										})
								}
								else {
									res.status(400).json({ message: 'Je n\'aime pas déjà ce commentaire !' })
								}
							}
						});
					}
					else {
						if (counter === 1) {
							comment.increment({ like: 1 }, { where: { id: req.params.id }})
								.then(() => {
									Like.create({
										usersLiked: true,
										userId: userId(req),
										commentId: req.params.id
									})
									res.status(200).json({ message: 'J\'aime !' })
								})
								.catch(err => res.status(400).send({ message: err.message }));
						}
						else if (counter === -1) {
							comment.increment({ dislike: -1 }, {	where: { id: req.params.id }})
							.then(() => {
								Like.create({
									usersDisliked: true,
									userId: userId(req),
									commentId: req.params.id
								})
								res.status(200).json({ message: 'Je n\'aime pas !' })
							})
							.catch(err => res.status(400).send({ message: err.message }));
						}
						else if (counter === 0) {
							res.status(400).json({ message: 'Opération impossible' })
						}
					}
				})
				.catch(err => res.status(400).send({ message: err.message }));
		})
		.catch(err => res.status(404).send({ message: err.message }));
};