const { check, validationResult } = require('express-validator');
const fs = require('fs');

exports.signup = [
    check('email')
    .isEmail()
    .normalizeEmail()
    .matches(/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/)
    .withMessage("Merci de renseigner une adresse email valide !"),
        (req, res, next) => { // Contrôle de l'email
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.statusMessage = errors.array().map(err => err.msg );
                res.status(400).end();
            }
            else {
                next();
            }
        },
    check('password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-zÀ-ÖØ-öø-ÿ\d@$!%*?&\s_-]{8,}$/)
    .withMessage("Le mot de passe doit contenir au minimun 8 caractères dont un chiffre, une lettre majuscule et une minuscule."),
        (req, res, next) => { // Contrôle du password
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.statusMessage = errors.array().map(err => err.msg );
                res.status(400).end();
            }
            else {
                next();
            }
        }
];