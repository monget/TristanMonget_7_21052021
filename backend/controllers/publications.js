const db = require("../models");
const Sequelize = require("sequelize");
const userId = require("../utils/userId.js");
const Publication = db.publication;
const Comment = db.comment;
const User = db.user;
const fs = require('fs');
const publication = require("../models/publication");
const { createPublication } = require("../middleware/validator");

exports.create = (req, res, next) => {
  Publication.create({
    title: req.body.title,
		message: req.body.message,
    attachement: `${req.protocol}://${req.get('host')}/images/publications/${req.file.filename}`,
		like: 0,
		userId: userId(req)
  })
    .then(() => res.status(201).json({ message: 'Publication créé !' }))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.modify = (req, res, next) => {
	const publicationObject = req.file ? // Contrôle si req.file existe
	{
		...req.body,
		attachement: `${req.protocol}://${req.get('host')}/images/publications/${req.file.filename}`
	} : { ...req.body }
	Publication.findOne({ where: { id: req.params.id }})
		.then(publication => {
			if (publication.userId == userId(req)) {
				if (req.file != undefined) {
					const filename = publication.attachement.split('/images/publications/')[1];
					fs.unlinkSync(`images/publications/${filename}`)
				}
				Publication.update( publicationObject, { where: { id: req.params.id }})
					.then(() => res.status(200).json({ message: 'Publication modifiée !' }))
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
				const filename = publication.attachement.split('/images/publications/')[1];
				if (filename != undefined) {
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
		include: [{ model: Comment, attributes: ['message', 'attachement', 'like'], required: false,
			include: [{ model: User,	attributes: ['pseudo'] }]
		}]
	})
		.then(publication => res.status(200).json(publication))
		.catch(err => res.status(500).send({ message: err.message }));
};

/*
exports.findAll = (req, res, next) => {
	Publication.findAll({
		include: [{ model: Comment, attributes: {exclude: ['updatedAt', 'publicationId']} , required: false, limit: 99,
			include: [{ model: User,	attributes: ['pseudo'] }],
		}],
		group: ['Publications.id']
	})
		.then(publications => {
			let publicationsComplete = [];
			publications.forEach(publication => {
				User.findByPk(publication.dataValues.userId)
					.then(user =>	{
						let publicationWithTotalComments = {
							id: publication.dataValues.id,
							title: publication.dataValues.title,
							message: publication.dataValues.message,
							attachement: publication.dataValues.attachement,
							like: publication.dataValues.like,
							createdAt: publication.dataValues.createdAt,
							updatedAt: publication.dataValues.updatedAt,
							userId: publication.dataValues.userId,
							publishedBy: user.dataValues.pseudo,
							totalComments: publication.dataValues.comments.length,
							comments: publication.dataValues.comments
						}
						publicationsComplete.push(publicationWithTotalComments)
						if (publications.length === publicationsComplete.length) {
							res.status(200).json(publicationsComplete)
						}
					})			
			})
		})
		.catch(err =>	res.status(400).send({ message: err.message }));
};*/



exports.findAll = (req, res, next) => {
	Publication.findAll({
		attributes: {
			include: [[Sequelize.fn("COUNT", Sequelize.col("Comments.publicationId")), "TotalComments"]]
		},
		include: [{	model: Comment, attributes: [] }, { model: User, attributes: ['pseudo'] }
		],
    group: ['Publications.id'],
	})
		.then(publications => {
			let arrayPublications = [];
			publications.forEach(publication => {
				let creatorPublication = publication.dataValues.user;
				Comment.findAll({ where: { publicationId: publication.dataValues.id } })
					.then(comments => {
						let arrayComments = [];
						comments.forEach(comment => {
							User.findByPk(comment.dataValues.userId)
								.then(user => {
									let objectComments = {
										id: comment.dataValues.id,
										message: comment.dataValues.message,
										attachement: comment.dataValues.attachement,
										like: comment.dataValues.like,
										createdAt: comment.dataValues.createdAt,
										userId: comment.dataValues.userId,
										commentedBy: user.dataValues.pseudo
									}
									arrayComments.push(objectComments);
									if (comments.length === arrayComments.length) {										
										let objectPublication = {
											id: publication.dataValues.id,
											title: publication.dataValues.title,
											message: publication.dataValues.message,
											attachement: publication.dataValues.attachement,
											like: publication.dataValues.like,
											createdAt: publication.dataValues.createdAt,
											updatedAt: publication.dataValues.updatedAt,
											userId: publication.dataValues.userId,
											publishedBy: creatorPublication.dataValues.pseudo,
											totalComments: publication.dataValues.TotalComments,
											comments: arrayComments
										}
										arrayPublications.push(objectPublication)
										if (publications.length === arrayPublications.length) {
											res.status(200).json(arrayPublications)
										}
									}
								})	
						})	
					})
			})
		})
		.catch(err =>	res.status(400).send({ message: err.message }));
};


exports.like = (req, res, next) => {
	counter = req.body.like;
	Publication.findByPk(req.params.id)
		.then(publication => {
			if (counter === 1) {
				publication.increment({ like: 1 }, { where: { id: req.params.id }})
					.then(() => res.status(200).json({ message: 'J\'aime !' }))
					.catch(err => res.status(400).send({ message: err.message }));
			}
			else if (counter === 0) {
				publication.increment({ like: -1 }, {	where: { id: req.params.id }})
					.then(() => res.status(200).json({ message: 'J\'aime annulé' }))
					.catch(err => res.status(400).send({ message: err.message }));
			}
		})
		.catch(err => res.status(404).send({ message: err.message }));
};
