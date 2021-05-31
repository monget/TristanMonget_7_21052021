<template>
  <div>
    <h1 id="h1">Connexion</h1>

    <div class="registration-connection_form">
      <form class="connectionForm" action="" method="post">
        <p>
          <label class="label" for="pseudo">Pseudo :</label>
          <input class="input" type="text" id="pseudo" name="pseudo" required><br /><br />
          <label class="label" for="password">Mot de passe :</label>
          <input class="input" type="password" id="password" name="password" required><span id="connection_errors"></span><br />
          <input class="submitForm" type="submit" name="submit" value="Connexion">
          <span>Pas encore de compte ?</span><br />
          <router-link to="/registration">Inscrivez-vous</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.connectionForm
{
  padding: 2.5% 0%;
  position: fixed;
  top: 35%;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  background-color: grey;
  border-radius: 30px;
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