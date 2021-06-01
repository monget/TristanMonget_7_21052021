<template>
  <div class="registration-connection_form">
    <form class="registrationForm" onSubmit="return control(this)" action="" method="post">
      <h1>Inscription</h1>
      <p>
        <label class="label" for="pseudo">Pseudo :</label>
        <input id="pseudo" class="input" type="text" name="pseudo" required pattern="[-_ A-Za-z0-9]{3,12}" minlength="3" maxlength="12" placeholder="De 3 à 12 caractères">
        <span id="pseudo_help"></span><br />
        <label class="label" for="password1">Mot de passe :</label>
        <input class="input" type="password" id="password1" name="password1" required minlength="6" placeholder="Au moins 6 caractères">
        <span id="password1_error"></span><br />
        <label class="label" for="password2">Confirmez le mot de passe :</label>
        <input class="input" type="password" id="password2" name="password2" required minlength="6" >
        <span id="password2_error"></span><br />
        <label class="label" for="email">Adresse email :</label>
        <input class="input" type="email" id="email" name="email" required pattern="^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$">
        <span id="email_help"></span><br />
        <input class="submitForm" type="submit" name="submit" onclick="control()" value="Valider">
        <span>Déjà un compte ?</span><br />
        <router-link to="/connection">Connectez-vous</router-link>
      </p>
    </form>
  </div>
</template>

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