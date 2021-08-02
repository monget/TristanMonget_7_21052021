<template>
  <main class="main" role="main" aria-label="main">
    <ValidationObserver class="form-registration-wrap" ref="form" v-slot="{ handleSubmit }">
      <form class="form-registration" role="form" aria-label="formulaire d'inscription" @submit.prevent="handleSubmit(createUser)">
        <h1 class="form-title">Inscription</h1>
        <p class="form-content">
          <ValidationProvider aria-label="pseudo" vid="user" name="pseudo" rules="required:@pseudo|min:3|max:12" v-slot="{ errors }">
            <label class="form-content__label" for="pseudo">Pseudo :</label>
            <input class="form-content__input" id="pseudo" type="text" name="pseudo" minlength="3" maxlength="12" placeholder="De 3 à 12 caractères" aria-describedby="pseudo_error" aria-required="true" v-model.trim="pseudo"/>
            <span class="form-content__error" id="pseudo_error">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider aria-label="mot de passe" name="mot de passe" rules="required:@mot de passe|min:8|regex" v-slot="{ errors }">
            <label class="form-content__label" for="password">Mot de passe :</label>
            <input class="form-content__input" type="password" id="password" name="password" minlength="8" placeholder="Au moins 8 caractères" aria-describedby="password_error" aria-required="true" v-model="password"/>
            <span class="form-content__error" id="password_error">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider aria-label="confirmer le mot de passe" name="ConfirmPassword" rules="ifexist:@mot de passe|requiredConfirmPassword|confirm_password:@mot de passe"  v-slot="{ errors }">
            <label class="form-content__label" for="confirm_password">Confirmez le mot de passe :</label>
            <input class="form-content__input" type="password" id="confirm_password" name="confirm_password" aria-describedby="confirm_password_error" aria-required="true" v-model="confirm_password"/>
            <span class="form-content__error" id="confirm_password_error">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider aria-label="email" vid="email" name="email" rules="required:@email|email" v-slot="{ errors }">
            <label class="form-content__label" for="email">Adresse email :</label>
            <input class="form-content__input" type="email" id="email" name="email" aria-describedby="email_error" aria-required="true" v-model="email"/>
            <span class="form-content__error" id="email_error">{{ errors[0] }}</span>
          </ValidationProvider>
          <button class="form-submit" aria-label="valider l'inscription" type="submit">Valider</button>
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
.form-registration-wrap {
  position: relative;
  top: 40%;
  transform: perspective(1px) translateY(-50%);
}
.form-registration {
  font-size: 20px;
  padding: 0 2% 2%;
  width: 47%;
  background-color: white;
  border-radius: 30px;
  margin: 50px auto;
}
.form-title {
  margin: 0px;
  font-family: "Roboto-Medium";
  font-weight: 500;
  font-size: 45px;
  text-align: center;
  padding: 15px 0;
}
.form-content {
  margin: auto;
  padding: 4%;
  background-color: rgba(236, 235, 235, 1);
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.50);
  text-align: center;
  &__label {
    display: block;
    margin-top: 10px;
    text-align: left;
    color: black;
  }
  &__input {
    font-size: 17px;
    width: 100%;
    display: block;
    padding: 5px;
    box-sizing: border-box;
  }
  &__error {
    color: red;
  }
}
.form-submit {
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
@media (min-width: 1904px) {
  .form-registration {
    font-size: 50px;
  }
  .form-title {
    font-size: 80px;
  }
  .form-content__input {
    font-size: 50px;
  }
  .form-submit {
    font-size: 50px;
  }
}
@media (min-width: 1264px) AND (max-width: 1904px) {
  .form-registration {
    font-size: 25px;
  }
  .form-title {
    font-size: 50px;
  }
  .form-content__input {
    font-size: 25px;
  }
  .form-submit {
    font-size: 25px;
  }
}
@media (min-width: 600px) AND (max-width: 960px) {
  .form-registration {
    border-radius: 15px;
    font-size: 17px;
    width: 55%;
  }
  .form-title {
    font-size: 30px;
  }
  .form-content__input {
    font-size: 17px;
  }
  .form-submit {
    font-size: 17px;
  }
}
@media (max-width: 600px) {
  .form-registration {
    padding: 0px 3% 3%;
    border-radius: 15px;
    font-size: 15px;
    width: 90%;
  }
  .form-title {
    font-size: 25px;
  }
  .form-content__input {
    font-size: 15px;
  }
  .form-submit {
    font-size: 15px;
  }
}

</style>