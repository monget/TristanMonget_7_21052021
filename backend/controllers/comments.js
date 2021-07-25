const db = require("../models");
const userId = require("../utils/userId.js")
const isAdmin = require("../utils/isAdmin.js");
const Comment = db.comment;
const User = db.user;
const Like = db.like;
const fs = require('fs');

exports.create = (req, res, next) => {
	const commentObject = req.file ? // Contrôle si req.file existe
	{
		...req.body,
		attachement: `${req.protocol}://${req.get('host')}/images/comments/${req.file.filename}`,
		publicationId: req.body.publicationId,
		userId: userId(req)
	} : { 
		...req.body,
		publicationId: req.body.publicationId,
		userId: userId(req)
	}
  Comment.create( commentObject )
		.then(result => {
			Comment.findByPk(result.id, {
				include: [{ model: User, attributes: ['pseudo', 'attachement'] }]
			})
				.then(comment => {
					const creatorComment = comment.dataValues.user
					const newComment = {
						id: comment.dataValues.id,
						message: comment.dataValues.message,
						attachement: comment.dataValues.attachement,
						like: comment.dataValues.like,
						dislike: comment.dataValues.dislike,
						stateLike: {
							disliked: false,
							liked: false
						},
						createdAt: comment.dataValues.createdAt,
						updatedAt: comment.dataValues.updatedAt,
						userId: comment.dataValues.userId,
						commentedBy: creatorComment.dataValues.pseudo,
						avatar: creatorComment.dataValues.attachement,
					}
					res.status(201).json(newComment)
				})
				.catch(err =>	res.status(400).send({ message: err.message }));
		})
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
				if (comment.attachement != null) {
					const filename = comment.attachement.split('/images/comments/')[1];
					fs.unlinkSync(`images/comments/${filename}`)
				}
			}
			Comment.update( commentObject, { where: { id: req.params.id }})
				.then(() => res.status(200).json( commentObject ))
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
			if (comment.userId == userId(req) || isAdmin(req) === true) {
				if (comment.attachement != null) {
					const filename = comment.attachement.split('/images/comments/')[1];
					fs.unlinkSync(`images/comments/${filename}`)
				}
				if (isAdmin(req) === true) {
					if (comment.userId == userId(req)) {
						Comment.destroy({	where: { id: req.params.id }})
						.then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
						.catch(err => res.status(400).send({ message: err.message }));
					}
					else {
						Comment.update({
							message: "Ce contenu n'est plus disponible.",
							attachement: null
							},
							{ where: { id: req.params.id }
						})
							.then(() => res.status(200).json({
								message: "Ce contenu n'est plus disponible.",
								attachement: null,
								disactive: true
								}
							))
							.catch(err => res.status(400).json({ message: err.message }));
					}
				}
				else {
					Comment.destroy({	where: { id: req.params.id }})
					.then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
					.catch(err => res.status(400).send({ message: err.message }));
				}
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

exports.findAll = (req, res, next) => {
  Comment.findAll(
		{	attributes: { exclude: ['updatedAt'] },
			include: [{ model: User, attributes: ['pseudo', 'attachement'] }]
		}
	)
		.then(comments => res.status(200).json(comments))
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