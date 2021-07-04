<template>
  <main>
    <div class="registration-connection_form">
      <Form class="registrationForm" @submit="onSubmit" :validation-schema="schema">
        <h1>Inscription</h1>
        <p>
          <label class="label" for="pseudo">Pseudo :</label>
          <input id="pseudo" class="input" type="text" name="pseudo" minlength="3" maxlength="12" placeholder="De 3 à 12 caractères"/>
          <label class="label" for="password">Mot de passe :</label>
          <input class="input" type="password" id="password" name="password" minlength="8" placeholder="Au moins 8 caractères"/>
          <label class="label" for="confirm_password">Confirmez le mot de passe :</label>
          <input class="input" type="password" id="confirm_password" name="confirm_password" minlength="6"/>
          <label class="label" for="email">Adresse email :</label>
          <input class="input" type="email" id="email" name="email"/>
          <button class="submitForm">Valider</button>
          <span>Déjà un compte ? <router-link to="/connection">Connectez-vous</router-link></span><br />
        </p>
      </Form>
    </div>
  </main>
</template>

<script>
import UserDataService from "../services/UserDataService";
import { Form } from 'vee-validate';
import * as Yup from "yup";
import router from "../router";

export default {
  name: "Registration",
  components: {
    Form,
  },
  setup() {
    function onSubmit(values) {
      const data =  {
        pseudo: values.pseudo,
        password: values.password,
        email: values.email
      }
      UserDataService.create(data)
        .then(response => {
          localStorage.setItem('pseudo', JSON.stringify(values.pseudo));
          router.push('/connection');
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
    const schema = Yup.object().shape({
      pseudo: Yup.string().min(3, "Minimun 3 caractères").max(12, "Maximun 12 caractères").required("Merci de renseigner un pseudo"),
      email: Yup.string().email("Merci de renseigner un email valide").required("Merci de renseigner un email"),
      password: Yup.string().min(8, "Le mot de passe doit contenir au minimun 8 caractères").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-zÀ-ÖØ-öø-ÿ\d@$!%*?&\s_-]{8,}$/, "Minimun un chiffre, une lettre majuscule et une minuscule").required("Merci de renseigner un mot de passe"),
      confirm_password: Yup.string().required("Merci de confirmer votre mot de passe").oneOf([Yup.ref("password")], "Votre mot de passe ne correspond pas"),
    });
    return {
      onSubmit,
      schema,
    };
  }
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "Roboto-Medium";
  src: local("Roboto-Medium"),
  url(../fonts/Roboto-Medium.ttf) format("truetype");
}
h1 {
  margin: 0px;
  font-family: "Roboto-Medium";
  font-weight: 500;
  font-size: 45px;
  text-align: center;
  padding: 15px 0;
}
.registration-connection_form {
  padding-top: 50px;
  padding-bottom: 50px;
  padding-left: 90px;
}
.registrationForm {
  font-size: 20px;
  padding: 0 2% 2%;
  width: 47%;
  background-color: white;
  border-radius: 30px;
}
@media (max-width: 425px) {
  .registrationForm {
    padding: 5%;
    width: 65%;
  }
}
.registrationForm p {
  margin: auto;
  padding: 4%;
  background-color: rgba(236, 235, 235, 1);
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.50);
  text-align: center;
}
.label {
  display: block;
  margin-top: 10px;
  text-align: left;
  color: black;
}
.input {
  font-size: 17px;
  width: 100%;
  display: block;
  padding: 5px;
  box-sizing: border-box;
}
.submitForm {
  font-size: 20px;
  display: block;
  width: 100%;
  margin: 4% 0px;
  font-weight: bold;
  color: white;
  background-color: rgb(27, 125, 223);
}
a {
  text-decoration: none;
  color: blue;
}
</style>