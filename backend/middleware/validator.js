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
				return res.status(400).json({ email: ["Merci de renseigner une adresse email valide !"] })
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
				return res.status(400).json({ password: ["Le mot de passe doit contenir au minimun 8 caractères dont un chiffre, une lettre majuscule et une minuscule."] })
			}
			else {
				next();
			}
		}
];

exports.Publication = [
	check('message').trim().blacklist(['$','<>','{}','/']).escape().unescape("&#x27;"),
		(req, res, next) => {
			if (req.file != undefined) {
				if (req.file.filename == "error") {
					fs.unlinkSync(`images/publications/error`);
					return res.status(400).json({ message: "Extensions image jpg, jpeg, bmp ou gif seulement autorisées !" })
				}
				else {
					next();
				}
			}
			else if (req.body.message.length === 0 && req.file == undefined) {
				return res.status(400).json({ message: "Votre publication ne peut être vide !" })
			}
			else {
				next();
			}
		}
];

exports.Comment = [
	check('message').trim().blacklist(['$','<>','{}','/']).escape().unescape("&#x27;"),
		(req, res, next) => {
			if (req.file != undefined) {
				if (req.file.filename == "error") {
					fs.unlinkSync(`images/comments/error`);
					return res.status(400).json({ image: ["Extensions image jpg, jpeg, bmp ou gif seulement autorisées !"] })
				}
				else {
					next();
				}
			}
			else if (req.body.message.length === 0 && req.file == undefined) {
				return res.status(400).json({ commentaire: ["Votre commentaire ne peut être vide !"] })
			}
			else {
				next();
			}
		}
];