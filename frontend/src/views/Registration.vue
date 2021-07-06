<template>
  <main>
    <ValidationObserver v-slot="{ invalid }" class="registration-connection_form">
      <form @submit.prevent="createUser" class="registrationForm">
        <h1>Inscription</h1>
        <p>
          <ValidationProvider name="Pseudo" rules="requiredPseudo|min:3|max:12" v-slot="{ errors }">
            <label class="label" for="pseudo">Pseudo :</label>
            <input id="pseudo" class="input" type="text" name="pseudo" minlength="3" maxlength="12" placeholder="De 3 à 12 caractères" v-model.trim="pseudo"/>
            <span>{{ errors[0] }}</span>
          </ValidationProvider>

          <ValidationProvider name="Password" rules="requiredPassword|min:8|regex" v-slot="{ errors }">
            <label class="label" for="password">Mot de passe :</label>
            <input class="input" type="password" id="password" name="password" minlength="8" placeholder="Au moins 8 caractères" v-model="password"/>
            <span>{{ errors[0] }}</span>
          </ValidationProvider>

          <ValidationProvider name="ConfirmPassword" rules="requiredConfirmPassword" v-slot="{ errors }">
            <label class="label" for="confirm_password">Confirmez le mot de passe :</label>
            <input class="input" type="password" id="confirm_password" name="confirm_password" minlength="8" v-model="confirm_password"/>
            <span>{{ errors[0] }}</span>
          </ValidationProvider>

          <ValidationProvider name="Email" rules="requiredEmail|email" v-slot="{ errors }">
            <label class="label" for="email">Adresse email :</label>
            <input class="input" type="email" id="email" name="email" v-model="email"/>
            <span>{{ errors[0] }}</span>
          </ValidationProvider>

          <button class="submitForm" :disabled="invalid">Valider</button>
          <span>Déjà un compte ? <router-link to="/connection">Connectez-vous</router-link></span><br />
        </p>
      </form>
    </ValidationObserver>
  </main>
</template>

<script>
/* import { Form } from 'vee-validate'; */

import UserDataService from "../services/UserDataService";

export default {
  name: "Registration",
  data() {
    return {
      pseudo: "",
      password: "",
      confirm_password: "",
      email: ""
    }
  },
  methods: {
    createUser(e) {
      const data =  {
        pseudo: this.pseudo,
        password: this.password,
        email: this.email
      }
      UserDataService.create(data)
        .then(response => {
          localStorage.setItem('pseudo', JSON.stringify(this.pseudo));
          this.$router.push('connection');
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
      e.preventDefault();
    }
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
span {
  display: block;
}
</style>