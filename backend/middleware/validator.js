const { check, validationResult } = require('express-validator');
const fs = require('fs');

exports.signup = [
	check('email')
	.isEmail()
	.normalizeEmail()
	.matches(/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/),
		(req, res, next) => { // Contrôle de l'email
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: "Merci de renseigner une adresse email valide !" })
			}
			else {
				next();
			}
		},
	check('password')
	.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-zÀ-ÖØ-öø-ÿ\d@$!%*?&\s_-]{8,}$/),
		(req, res, next) => { // Contrôle du password
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: "Le mot de passe doit contenir au minimun 8 caractères dont un chiffre, une lettre majuscule et une minuscule." })
			}
			else {
				next();
			}
		}
];

exports.createPublication = [
	check('title').not().isEmpty().trim().blacklist(['$','<>','{}','/']).escape().unescape("&#x27;"),
	check('message').not().isEmpty().trim().blacklist(['$','<>','{}','/']).escape().unescape("&#x27;"),
		(req, res, next) => {
			if (req.file != undefined) {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					fs.unlinkSync(`images/publications/${req.file.filename}`)
					return res.status(400).json({ message: "Merci de renseigner tous les champs !" })
				}
				else if (req.file.filename == "error") {
					fs.unlinkSync(`images/publications/error`);
					return res.status(400).json({ message: "Extensions image jpg, jpeg ou bmp seulement autorisées !" })
				}
				else {
					next();
				}
			}
			else {
				return res.status(400).json({ message: "Merci d'ajouter une image !" })
			}
		}
];

exports.modifyPublication = [
	check('title').not().isEmpty().trim().blacklist(['$','<>','{}','/']).escape().unescape("&#x27;"),
	check('message').not().isEmpty().trim().blacklist(['$','<>','{}','/']).escape().unescape("&#x27;"),
		(req, res, next) => {
			if (req.file != undefined) {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					fs.unlinkSync(`images/publications/${req.file.filename}`)
					return res.status(400).json({ message: "Merci de renseigner tous les champs !" })
				}
				else {
					if (req.file == undefined) {
						next();
					}
					else if (req.file.filename == "error") {
						fs.unlinkSync(`images/publications/error`);
						return res.status(400).json({ message: "Extensions image jpg, jpeg ou bmp seulement autorisées !" })
					}
					else {
						next();
					}
				}
			}
			else {
				return res.status(400).json({ message: "Merci d'ajouter une image !" })
			}
		}
];

exports.createComment = [
	check('message').not().isEmpty().trim().blacklist(['$','<>','{}','/']).escape().unescape("&#x27;"),
		(req, res, next) => {
			if (req.file != undefined) {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					fs.unlinkSync(`images/comments/${req.file.filename}`)
					return res.status(400).json({ message: "Merci de renseigner un message !" })
				}
				else if (req.file.filename == "error") {
					fs.unlinkSync(`images/comments/error`);
					return res.status(400).json({ message: "Extensions image jpg, jpeg ou bmp seulement autorisées !" })
				}
				else {
					next();
				}
			}
			else {
				return res.status(400).json({ message: "Merci d'ajouter une image !" })
			}
		}
];

exports.modifyComment = [
	check('message').not().isEmpty().trim().blacklist(['$','<>','{}','/']).escape().unescape("&#x27;"),
		(req, res, next) => {
			if (req.file != undefined) {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					fs.unlinkSync(`images/comments/${req.file.filename}`)
					return res.status(400).json({ message: "Merci de renseigner un message !" })
				}
				else {
					if (req.file == undefined) {
						next();
					}
					else if (req.file.filename == "error") {
						fs.unlinkSync(`images/comments/error`);
						return res.status(400).json({ message: "Extensions image jpg, jpeg ou bmp seulement autorisées !" })
					}
					else {
						next();
					}
				}
			}
			else {
				return res.status(400).json({ message: "Merci d'ajouter une image !" })
			}
		}
];