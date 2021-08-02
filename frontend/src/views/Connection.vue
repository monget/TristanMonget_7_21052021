<template>
  <main class="main" role="main" aria-label="main">
    <ValidationObserver class="form-connection-wrap" v-slot="{ handleSubmit }">
      <form class="form-connection" role="form" aria-label="formulaire de connection" @submit.prevent="handleSubmit(logUser)">
        <h1 class="form-title">Connection</h1>
          <p class="form-content">
            <ValidationProvider aria-label="pseudo" vid="pseudo" name="pseudo" rules="required:@pseudo" v-slot="{ errors }">
              <label class="form-content__label" for="pseudo">Pseudo :</label>
              <input class="form-content__input" type="text" id="pseudo" name="pseudo" aria-describedby="pseudo_error" aria-required="true" v-model.trim="pseudo"/>
              <span class="form-content__error" id="pseudo_error">{{ errors[0] }}</span>
            </ValidationProvider>
            <ValidationProvider aria-label="mot de passe" ref="error" vid="mot de passe" name="mot de passe" rules="required:@mot de passe" v-slot="{ errors }">
              <label class="form-content__label" for="mot de passe">Mot de passe :</label>
              <input class="form-content__input" type="password" id="mot de passe" name="mot de passe" aria-describedby="password_error" aria-required="true" v-model="password"/>
              <span class="form-content__error" id="password_error">{{ errors[0] }}</span>
            </ValidationProvider>
            <button class="form-submit" aria-label="se connecter" type="submit">Valider</button>
            <span aria-label="pas encore de compte">Pas encore de compte ? <router-link to="/registration">Inscrivez-vous</router-link></span>
          </p>
      </form>
    </ValidationObserver>
  </main>
</template>

<script>
export default {
  name: "Connection",
  data() {
    return {
      pseudo: "",
      password: ""
    };
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
    logUser() {
      const data = {
        pseudo: this.pseudo,
        password: this.password
      };
      this.$store.dispatch('auth/login', data)
        .then(() => {
          this.$router.push('/publications')
        })
        .catch(e => {
          this.$refs.error.setErrors([e.response.data.message])
        });
    }
  }
}
</script>


<style lang="scss" scoped>
@font-face {
  font-family: "Roboto-Medium";
  src: local("Roboto-Medium"),
  url(../fonts/Roboto-Medium.ttf) format("truetype");
}
.form-connection-wrap {
  position: relative;
  top: 40%;
  transform: perspective(1px) translateY(-50%);
}
.form-connection {
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
  .form-connection {
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
  .form-connection {
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
  .form-connection {
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
  .form-connection {
    padding: 0px 3% 3%;
    border-radius: 15px;
    font-size: 15px;
    width: 90%;
  }
  .form-title {
    font-size: 25px;
  }
  .form-content {
    padding: 3%;
    &__input {
      font-size: 15px;
    }
  }
  .form-submit {
    font-size: 15px;
  }
}
</style>

