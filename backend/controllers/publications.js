const db = require("../models");
const Sequelize = require("sequelize");
const userId = require("../utils/userId.js");
const Publication = db.publication;
const Comment = db.comment;
const User = db.user;
const fs = require('fs');
const { createComment } = require("../middleware/validator");

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

exports.findAll = (req, res, next) => {
	Publication.findAll({
		attributes: {
			exclude: ['userId', 'updatedAt'],
			include: [[Sequelize.fn("COUNT", Sequelize.col("Comments.publicationId")), "TotalComments"]]
		},
		include: [{	model: Comment, attributes: [] }, { model: User, attributes: ['pseudo'] }
		],
    group: ['Publications.id'],
	})
		.then(publications => {
			let totalPublications = [];
			for (let i = 0; i < publications.length; i++) {
				let user = publications[i].dataValues.user;
				Comment.findAll({ where: { publicationId: publications[i].dataValues.id } })
					.then(comments => {
						let totalComments = [];
						for (let i = 0; i < comments.length; i++) {
							let completObjectComments = {
								id: comments[i].dataValues.id,
								message: comments[i].dataValues.message,
								attachement: comments[i].dataValues.attachement,
								like: 0,
								createdAt: comments[i].dataValues.createdAt,
								userId: comments[i].dataValues.userId
							}
							totalComments.push(completObjectComments);
						}
						addComments(totalComments, user)
						if (totalPublications.length === publications.length) {
							res.status(200).json(totalPublications)
						}
					})
					function addComments(comments, user) {
						let completObject =  { ...publications[i].dataValues, user: user.dataValues.pseudo, comments: comments }
						totalPublications.push(completObject)
					}
			}
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
