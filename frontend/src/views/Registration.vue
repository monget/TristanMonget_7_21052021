<template>
  <main>
    <div class="registration-connection_form">
      <Form class="registrationForm" @submit="onSubmit" :validation-schema="schema">
        <h1>Inscription</h1>
        <p>
          <label class="label" for="pseudo">Pseudo :</label>
          <Field id="pseudo" class="input" type="text" name="pseudo" minlength="3" maxlength="12" placeholder="De 3 à 12 caractères"/>
          <ErrorMessage name="pseudo"/><br />
          <label class="label" for="password">Mot de passe :</label>
          <Field class="input" type="password" id="password" name="password" minlength="6" placeholder="Au moins 6 caractères"/>
          <ErrorMessage name="password"/><br />
          <label class="label" for="confirm_password">Confirmez le mot de passe :</label>
          <Field class="input" type="password" id="confirm_password" name="confirm_password" minlength="6"/>
          <ErrorMessage name="confirm_password"/><br />
          <label class="label" for="email">Adresse email :</label>
          <Field class="input" type="email" id="email" name="email"/>
          <ErrorMessage name="email"/><br />
          <button class="submitForm">Valider</button>
          <span>Déjà un compte ?</span><br />
          <router-link to="/connection">Connectez-vous</router-link>
        </p>
      </Form>
    </div>
  </main>
</template>

<script>
import UserDataService from "../services/UserDataService";
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as Yup from "yup";
import router from "../router";

export default {
  name: "Registration",
  components: {
    Form,
    Field,
    ErrorMessage,
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
      password: Yup.string().min(6, "Minimun 6 caractères").required("Merci de renseigner un mot de passe"),
      confirm_password: Yup.string().required("Merci de confirmer votre mot de passe")
        .oneOf([Yup.ref("password")], "Votre mot de passe ne correspond pas"),
    });
    return {
      onSubmit,
      schema,
    };
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin: 0px;
  padding-bottom: 5%;
  color: white;
}
.registrationForm
{
  padding: 2%;
  margin: 50px auto;
  width: 40%;
  background-color: grey;
  border-radius: 30px;
}

@media (max-width: 425px) {
  .registrationForm {
    padding: 5%;
    width: 65%;
  }
}

.registrationForm p
{
  margin: auto;
  padding: 5%;
  background-color: rgba(255, 255, 255, 0.904);
  text-align: center;
}
.label
{
  display: block;
  margin-top: 10px;
  text-align: left;
  padding-left: 1%;
  color: black;
}
.input
{
  width: 96%;
}
.submitForm
{
  width: 99%;
  margin: 13px 0px;
  font-weight: bold;
  background-color: rgb(27, 125, 223);
}
a {
  text-decoration: none;
  color: blue;
}
</style>