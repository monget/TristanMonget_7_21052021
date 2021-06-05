<template>
  <main>
    <div class="registration-connection_form">
      <Form class="connectionForm" @submit="onSubmit" :validation-schema="schema">
        <h1>Connexion</h1>
        <p>
          <label class="label" for="pseudo">Pseudo :</label>
          <Field class="input" type="text" id="pseudo" name="pseudo" v-model="user.pseudo"/>
          <ErrorMessage name="pseudo"/><br /><br />
          <label class="label" for="password">Mot de passe :</label>
          <Field class="input" type="password" id="password" name="password"/>
          <ErrorMessage name="password"/><br />
          <button class="submitForm">Connexion</button>
          <span>Pas encore de compte ?</span><br />
          <router-link to="/registration">Inscrivez-vous</router-link>
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
  name: "Connection",
  data() {
    return {
      user: {
        pseudo: "",
        token: "",
        published: false
      },
    };
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    function onSubmit(values) {
      const data = {
        pseudo: values.pseudo,
        password: values.password
      };
      UserDataService.find(data)
        .then(response => {
          if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
          router.push('/');
        }})
        .catch(e => {
          console.log(e);
        });
    }
    const schema = Yup.object().shape({
      pseudo: Yup.string().required("Merci de renseigner un pseudo"),
      password: Yup.string().required("Merci de renseigner un mot de passe"),
    });
    return {
      onSubmit,
      schema,
    };
  },
  mounted() {
    if(localStorage.pseudo)
      this.user.pseudo = JSON.parse(localStorage.pseudo);
  }
};
</script>


<style lang="scss" scoped>
h1 {
  margin: 0px;
  padding-bottom: 5%;
  color: white;
}
.connectionForm
{
  padding: 2%;
  margin: 50px auto;
  width: 40%;
  background-color: grey;
  border-radius: 30px;
}

@media (max-width: 425px) {
  .connectionForm {
    padding: 5%;
    width: 65%;
  }
}

.connectionForm p
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