<template>
  <main>
    <ValidationObserver v-slot="{ handleSubmit }" class="registration-connection_form">
      <form @submit.prevent="handleSubmit(logUser)" class="connectionForm">
        <h1>Connection</h1>
          <p>
            <ValidationProvider vid="pseudo" name="pseudo" rules="required:@pseudo" v-slot="{ errors }">
              <label class="label" for="pseudo">Pseudo :</label>
              <input class="input" type="text" id="pseudo" name="pseudo" v-model.trim="pseudo"/>
              <span>{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider ref="error" vid="mot de passe" name="mot de passe" rules="required:@mot de passe" v-slot="{ errors }">
              <label class="label" for="mot de passe">Mot de passe :</label>
              <input class="input" type="password" id="mot de passe" name="mot de passe" v-model="password"/>
              <span>{{ errors[0] }}</span>
            </ValidationProvider>

            <button class="submitForm">Valider</button>
            <span>Pas encore de compte ? <router-link to="/registration">Inscrivez-vous</router-link></span>
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
span {
  display: block;
}
</style>