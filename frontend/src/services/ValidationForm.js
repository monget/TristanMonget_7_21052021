import { extend } from 'vee-validate';
import { required, email, min, max, regex } from 'vee-validate/dist/rules';


extend('requiredPseudo', {
  ...required,
  message: 'Merci de renseigner un pseudo'
});

extend('requiredPassword', {
  ...required,
  message: 'Merci de renseigner un mot de passe'
});

extend('requiredConfirmPassword', {
  ...required,
  message: 'Merci de confirmer votre mot de passe'
});

extend('requiredEmail', {
  ...required,
  message: 'Merci de renseigner un email'
});

extend('min', {
  ...min,
  params: ['min'],
  validate: (value, { min }) => {
    if (min < value.length) {
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
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-zÀ-ÖØ-öø-ÿ\d@$!%*?&\s_-]{8,}$/.test(value),
  message: 'Minimun un chiffre, une lettre majuscule et une minuscule'
});