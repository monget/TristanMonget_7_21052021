const db = require("../models");
const Sequelize = require("sequelize");
const userId = require("../utils/userId.js");
const Publication = db.publication;
const Comment = db.comment;
const User = db.user;
const Like = db.like;
const fs = require('fs');

exports.create = (req, res, next) => {
	const publicationObject = req.file ? // Contrôle si req.file existe
	{
		...req.body,
		attachement: `${req.protocol}://${req.get('host')}/images/publications/${req.file.filename}`,
		userId: userId(req)
	} : { 
		...req.body,
		userId: userId(req)
	}
	Publication.create(publicationObject)
		.then(result => {
			Publication.findByPk(result.id, {
				include: [{ model: User, attributes: ['pseudo', 'attachement'] }]
			})
				.then(publication => {
					let creatorPublication = publication.dataValues.user;
					const newPublication = {
						id: publication.dataValues.id,
						message: publication.dataValues.message,
						attachement: publication.dataValues.attachement,
						like: publication.dataValues.like,
						dislike: publication.dataValues.dislike,
						stateLike: {
							disliked: false,
							liked: false
						},
						createdAt: publication.dataValues.createdAt,
						updatedAt: publication.dataValues.updatedAt,
						userId: publication.dataValues.userId,
						publishedBy: creatorPublication.dataValues.pseudo,
						avatar: creatorPublication.dataValues.attachement,
						totalComments: 0,
					}
					res.status(201).json(newPublication)
				})
				.catch(err =>	res.status(400).send({ message: err.message }));
		})
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.modify = (req, res, next) => {
	const publicationObject = req.file ?
	{
		...req.body,
		attachement: `${req.protocol}://${req.get('host')}/images/publications/${req.file.filename}`
	} : { ...req.body }
	Publication.findOne({ where: { id: req.params.id }})
		.then(publication => {
			if (publication.userId == userId(req)) {
				if (req.file != undefined) {
					if (publication.attachement != null) {
						const filename = publication.attachement.split('/images/publications/')[1];
						fs.unlinkSync(`images/publications/${filename}`)
					}
				}
				Publication.update( publicationObject, { where: { id: req.params.id }})
					.then(() => res.status(200).json( publicationObject ))
					.catch(err => res.status(400).json({ message: err.message }));		
			}
			else {
				return res.status(400).json({ message: "Opération interdite !" });
			}
		})
		.catch(error => res.status(400).json({ error }));
};

exports.delete = (req, res, next) => {
	Publication.findOne({ where: { id: req.params.id }})
		.then(publication => {
			if (publication.userId == userId(req)) {
				if (publication.attachement != null) {
					const filename = publication.attachement.split('/images/publications/')[1];
					fs.unlinkSync(`images/publications/${filename}`)
				}
				Publication.destroy({	where: { id: req.params.id }})
					.then(() => res.status(200).json({ message: 'Publication supprimé !' }))
					.catch(err => res.status(400).send({ message: err.message }));
			}
			else {
				return res.status(400).json({ message: "Opération interdite !" });
			}
		})
		.catch(error => res.status(400).json({ error }));
};

exports.findOne = (req, res, next) => {
  Publication.findByPk(req.params.id, {
		attributes: {
			include: [[Sequelize.fn("COUNT", Sequelize.col("Comments.publicationId")), "TotalComments"]]
		},
		include: [
			{	model: Comment, attributes: [] },
			{ model: User, attributes: ['pseudo', 'attachement'] },
		],
    group: ['Publications.id'],
	})
		.then(publication => {
			Like.findOne({ where: { publicationId: req.params.id, userId: userId(req) } })
				.then(like => {
					const statePublicationLike = {}
					if (like != null) {
						statePublicationLike.liked = like.dataValues.usersLiked,
						statePublicationLike.disliked = like.dataValues.usersDisliked
					}
					else {
						statePublicationLike.liked = false
						statePublicationLike.disliked = false
					}
					let creatorPublication = publication.dataValues.user;
					if (publication.dataValues.TotalComments === 0) {
						const publicationWithoutComment = {
							id: publication.dataValues.id,
							message: publication.dataValues.message,
							attachement: publication.dataValues.attachement,
							like: publication.dataValues.like,
							dislike: publication.dataValues.dislike,
							stateLike: statePublicationLike,
							createdAt: publication.dataValues.createdAt,
							updatedAt: publication.dataValues.updatedAt,
							userId: publication.dataValues.userId,
							publishedBy: creatorPublication.dataValues.pseudo,
							avatar: creatorPublication.dataValues.attachement,
							totalComments: publication.dataValues.TotalComments,
							comments: []
						}
						res.status(200).json(publicationWithoutComment)
					}
					else {
						Comment.findAll({ where: { publicationId: publication.dataValues.id },
							include: [{ model: Like, where: { userId: userId(req) }, required: false }]
						})
							.then(comments => {
								let arrayComments = [];
								comments.forEach(comment => {
									const stateCommentLike = {}
									comment.dataValues.likes.forEach(like => {
											stateCommentLike.liked = like.dataValues.usersLiked,
											stateCommentLike.disliked = like.dataValues.usersDisliked
									})
									if (comment.dataValues.likes.length === 0) {
										stateCommentLike.liked = false
										stateCommentLike.disliked = false
									}
									User.findByPk(comment.dataValues.userId)
										.then(user => {
											let objectComments = {
												id: comment.dataValues.id,
												message: comment.dataValues.message,
												attachement: comment.dataValues.attachement,
												like: comment.dataValues.like,
												dislike: comment.dataValues.dislike,
												stateLike: stateCommentLike,
												createdAt: comment.dataValues.createdAt,
												userId: comment.dataValues.userId,
												commentedBy: user.dataValues.pseudo,
												avatar: user.dataValues.attachement
											}
											arrayComments.push(objectComments);
											
											if (comments.length === arrayComments.length) {										
												let objectPublication = {
													id: publication.dataValues.id,
													message: publication.dataValues.message,
													attachement: publication.dataValues.attachement,
													like: publication.dataValues.like,
													dislike: publication.dataValues.dislike,
													stateLike: statePublicationLike,
													createdAt: publication.dataValues.createdAt,
													updatedAt: publication.dataValues.updatedAt,
													userId: publication.dataValues.userId,
													publishedBy: creatorPublication.dataValues.pseudo,
													avatar: creatorPublication.dataValues.attachement,
													totalComments: publication.dataValues.TotalComments,
													comments: arrayComments
												}
												res.status(200).json(objectPublication)
											}
										})	
								})
							})
					}
				})
				.catch(err =>	res.status(400).send({ message: err.message }));
		})
		.catch(err =>	res.status(400).send({ message: err.message }));
};


exports.findAll = (req, res, next) => {
	Publication.findAll({
		order: [
			['id', 'DESC']
		],
		attributes: {
			include: [[Sequelize.fn("COUNT", Sequelize.col("Comments.publicationId")), "TotalComments"]]
		},
		include: [
			{	model: Comment, attributes: [] },
			{ model: User, attributes: ['pseudo', 'attachement'] }
		],
    group: ['Publications.id'],
	})
		.then(publications => {
			let arrayPublications = [];
			publications.forEach(publication => {
				Like.findOne({ where: { publicationId: publication.dataValues.id, userId: userId(req) } })
					.then(like => {
						const statePublicationLike = {}
						if (like != null) {
							statePublicationLike.liked = like.dataValues.usersLiked,
							statePublicationLike.disliked = like.dataValues.usersDisliked
						}
						else {
							statePublicationLike.liked = false
							statePublicationLike.disliked = false
						}
						let creatorPublication = publication.dataValues.user;

						const publicationObject = {
							id: publication.dataValues.id,
							message: publication.dataValues.message,
							attachement: publication.dataValues.attachement,
							like: publication.dataValues.like,
							dislike: publication.dataValues.dislike,
							stateLike: statePublicationLike,
							createdAt: publication.dataValues.createdAt,
							updatedAt: publication.dataValues.updatedAt,
							userId: publication.dataValues.userId,
							publishedBy: creatorPublication.dataValues.pseudo,
							avatar: creatorPublication.dataValues.attachement,
							totalComments: publication.dataValues.TotalComments,
						}
						arrayPublications.push(publicationObject)

						if (publications.length === arrayPublications.length) {
							res.status(200).json(arrayPublications)
						}
					})
					.catch(err =>	res.status(400).send({ message: err.message }));
			})	
		})
		.catch(err =>	res.status(400).send({ message: err.message }));
};

exports.like = (req, res, next) => {
	counter = req.body.like;
	Publication.findByPk(req.params.id, {	include: [{ model: Like, attributes: ['usersLiked', 'usersDisliked', 'userId', 'publicationId'], required: false }] })
		.then(publication => {
			Like.findAll({ where: { publicationId: req.params.id, userId: userId(req)}})
				.then(likes => {
					const arrayUserId = [];
					publication.likes.forEach(likes => {
						arrayUserId.push(likes.dataValues.userId)
					})
					if (arrayUserId.includes(userId(req))) {
						likes.forEach(like => {
							if (counter === 1) {
								if (like.dataValues.usersDisliked === true) {
									Like.update({ usersLiked: true, usersDisliked: false }, { where: { userId: userId(req), publicationId: req.params.id }})
										.then(() => {
											publication.increment({ like: 1, dislike: 1 }, {	where: { id: req.params.id }})
												.then(() => res.status(200).json({ message: 'Finalement j\'aime ! !' }))
												.catch(err => res.status(400).send({ message: err.message }));
									})
								}
								else {
									res.status(400).json({ message: 'j\'aime déjà cette publication !' })
								}
							}
							else if (counter === 0) {
								if (like.dataValues.usersLiked === true) {
									Like.destroy({ where: { userId: userId(req), publicationId: req.params.id }})
										.then(() => {
											publication.increment({ like: -1 }, { where: { id: req.params.id }})
												.then(() => res.status(200).json({ message: 'J\'aime annulé'}))
												.catch(error => res.status(400).json({ error }));
										})
								}
								else {
									Like.destroy({ where: { userId: userId(req), publicationId: req.params.id }})
										.then(() => {
											publication.increment({ dislike: 1 }, { where: { id: req.params.id }})
												.then(() => res.status(200).json({ message: 'Je n\'aime pas annulé'}))
												.catch(error => res.status(400).json({ error }));
										})
								}
							}
							else if (counter === -1) {
								if (like.dataValues.usersLiked === true) {
									Like.update({ usersLiked: false, usersDisliked: true }, { where: { userId: userId(req), publicationId: req.params.id }})
										.then(() => {
											publication.increment({ like: -1, dislike: -1 }, {	where: { id: req.params.id }})
												.then(() => res.status(200).json({ message: 'Je n\'aime plus !' }))
												.catch(err => res.status(400).send({ message: err.message }));
										})
								}
								else {
									res.status(400).json({ message: 'Je n\'aime pas déjà cette publication !' })
								}
							}
						});
					}
					else {
						if (counter === 1) {
							publication.increment({ like: 1 }, { where: { id: req.params.id }})
								.then(() => {
									Like.create({
										usersLiked: true,
										userId: userId(req),
										publicationId: req.params.id
									})
									res.status(200).json({ message: 'J\'aime !' })
								})
								.catch(err => res.status(400).send({ message: err.message }));
						}
						else if (counter === -1) {
							publication.increment({ dislike: -1 }, {	where: { id: req.params.id }})
							.then(() => {
								Like.create({
									usersDisliked: true,
									userId: userId(req),
									publicationId: req.params.id
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