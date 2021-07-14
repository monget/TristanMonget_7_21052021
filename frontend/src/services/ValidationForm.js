import { extend } from 'vee-validate';
import { required, email, min, max, regex } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  params: ['target'],
  validate(value) {
    if (value != 0) {
      return true;
    }
    return false;
  },
  message: 'Merci de renseigner un {target}'
});

extend('requiredConfirmPassword', {
  ...required,
  message: 'Merci de confirmer votre mot de passe'
});

extend('confirm_password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Les mots de passe ne correspondent pas !'
});

extend('ifexist', {
  params: ['target'],
  validate(value, { target }) {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-zÀ-ÖØ-öø-ÿ\d@$!%*?&\s_-]{8,}$/.test(target) == true) {
      return true;
    }
    return false;
  },
  message: 'Vous n\'avez pas renseigné correctement le mot de passe !'
});

extend('min', {
  ...min,
  params: ['min'],
  validate: (value, { min }) => {
    if (min <= value.length) {
      return true;
    }
    return false;
  },
  message: "Minimun {min} caractères"
});

extend('max', {
  ...max,
  message: 'Maximun 12 caractères'
});

extend('email', {
  ...email,
  message: 'Merci de renseigner un email valide'
});

extend('regex', {
  ...regex,
  validate: value =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-zÀ-ÖØ-öø-ÿ\d@$!%*?&\s_-]{7,}$/.test(value),
  message: 'Minimun un chiffre, une lettre majuscule et une minuscule'
});