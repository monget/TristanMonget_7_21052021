<template>
  <main>
    <div class="registration-connection_form">
      <form class="connectionForm"> <!-- action="" method="post" -->
        <h1>Connexion</h1>
        <p>
          <label class="label" for="pseudo">Pseudo :</label>
          <input class="input" type="text" id="pseudo" name="pseudo" v-model="user.pseudo" required><br /><br />
          <label class="label" for="password">Mot de passe :</label>
          <input class="input" type="password" id="password" name="password" v-model="user.password" required><span id="connection_errors"></span><br />
          <input class="submitForm" type="submit" name="submit" @click="findUser" onclick="control()" value="Connexion">
          <span>Pas encore de compte ?</span><br />
          <router-link to="/registration">Inscrivez-vous</router-link>
        </p>
      </form>
    </div>
  </main>
</template>

<script>
import UserDataService from "../services/UserDataService";

export default {
  name: "Connectionr",
  data() {
    return {
      user: {
        pseudo: "",
        token: "",
        published: false
      },
      submitted: false
    };
  },
  methods: {
    findUser() {
      var data = {
        pseudo: this.user.pseudo,
        password: this.user.password
      };

      UserDataService.find(data)
        .then(response => {
          if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
          this.submitted = true;
        })
        .catch(e => {
          console.log(e);
        });
    },
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