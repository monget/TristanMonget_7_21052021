<template>
  <main>
    <div class="registration-connection_form">
      <Form class="connectionForm" @submit="onSubmit" :validation-schema="schema">
        <h1>Connection</h1>
          <p>
            <label class="label" for="pseudo">Pseudo :</label>
            <input class="input" type="text" id="pseudo" name="pseudo" v-model="user.pseudo"/><br />
            <label class="label" for="password">Mot de passe :</label>
            <input class="input" type="password" id="password" name="password"/>
            <button class="submitForm">Valider</button>
            <span>Pas encore de compte ? <router-link to="/registration">Inscrivez-vous</router-link></span>
            
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
    //Field,
    //ErrorMessage,
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
          router.push('/about');
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
.connectionForm {
  font-size: 20px;
  padding: 0 2% 2%;
  width: 47%;
  background-color: white;
  border-radius: 30px;
}
@media (max-width: 425px) {
  .connectionForm {
    padding: 5%;
    width: 65%;
  }
}
.connectionForm p {
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
  margin-bottom: 10px;
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