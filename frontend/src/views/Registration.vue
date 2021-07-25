<template>
  <main role="main" aria-label="main">
    <ValidationObserver ref="form" v-slot="{ handleSubmit }" class="registration-connection_form">
      <form role="form" aria-label="formulaire d'inscription" @submit.prevent="handleSubmit(createUser)" class="registrationForm">
        <h1>Inscription</h1>
        <p>
          <ValidationProvider aria-label="pseudo" vid="user" name="pseudo" rules="required:@pseudo|min:3|max:12" v-slot="{ errors }">
            <label class="label" for="pseudo">Pseudo :</label>
            <input id="pseudo" class="input" type="text" name="pseudo" minlength="3" maxlength="12" placeholder="De 3 à 12 caractères" aria-describedby="pseudo_error" aria-required="true" v-model.trim="pseudo"/>
            <span id="pseudo_error" class="error">{{ errors[0] }}</span>
          </ValidationProvider>

          <ValidationProvider aria-label="mot de passe" name="mot de passe" rules="required:@mot de passe|min:8|regex" v-slot="{ errors }">
            <label class="label" for="password">Mot de passe :</label>
            <input class="input" type="password" id="password" name="password" minlength="8" placeholder="Au moins 8 caractères" aria-describedby="password_error" aria-required="true" v-model="password"/>
            <span id="password_error" class="error">{{ errors[0] }}</span>
          </ValidationProvider>

          <ValidationProvider aria-label="confirmer le mot de passe" name="ConfirmPassword" rules="ifexist:@mot de passe|requiredConfirmPassword|confirm_password:@mot de passe"  v-slot="{ errors }">
            <label class="label" for="confirm_password">Confirmez le mot de passe :</label>
            <input class="input" type="password" id="confirm_password" name="confirm_password" aria-describedby="confirm_password_error" aria-required="true" v-model="confirm_password"/>
            <span id="confirm_password_error" class="error">{{ errors[0] }}</span>
          </ValidationProvider>

          <ValidationProvider aria-label="email" vid="email" name="email" rules="required:@email|email" v-slot="{ errors }">
            <label class="label" for="email">Adresse email :</label>
            <input class="input" type="email" id="email" name="email" aria-describedby="email_error" aria-required="true" v-model="email"/>
            <span id="email_error" class="error">{{ errors[0] }}</span>
          </ValidationProvider>

          <button aria-label="valider l'inscription" type="submit" class="submitForm">Valider</button>
          <span aria-label="déjà un compte">Déjà un compte ? <router-link to="/connection">Connectez-vous</router-link></span>
        </p>
      </form>
    </ValidationObserver>
  </main>
</template>

<script>
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
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/publications');
    }
  },
  methods: {
    createUser() {
      const data = {
        pseudo: this.pseudo,
        password: this.password,
        email: this.email
      };
      this.$store.dispatch('auth/signup', data)
        .then(() => {
          this.$router.push('/publications')
        })
        .catch(e => {
          this.$refs.form.setErrors(e.response.data)
        });
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
.error {
  color: red;
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