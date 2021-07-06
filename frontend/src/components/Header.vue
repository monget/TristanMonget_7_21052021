<template>
  <div class="header">
    <header>
      <div class="logo">
        <router-link to="/">
          <img alt="Groupomania logo" src="../assets/icon-left-font-monochrome-black.svg">
        </router-link>
      </div>
      <div class="buttons"> <!-- v-if="connection == false" -->
        <router-link to="/registration">{{ button }}</router-link>
        <router-link to="/connection">Connection</router-link>
      </div>
      <!--<div v-else @click.prevent="logOut" class="buttons">
        <router-link to="/connection">Déconnection</router-link>
      </div> -->
    </header>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    button: String
  }
}
</script>

<style lang="scss">
header {
  padding: 5px;
  display: flex;
  align-items: center;
  border: 1px solid grey;
  background-color: grey;
  justify-content: space-between;
  & .logo {
    width: 50%;
  }
  img {
    width: 100%;
  }
  & .buttons {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    & a {
      padding: 16px;
      border: 2px solid;
      border-radius: 30px;
      background: white;
      font-size: 1.2em;
      font-weight: bolder;
    }
  }
  a {
    text-decoration: none;
    color: black;
  }
}
@media (max-width: 425px) {
  header {
    flex-direction: column;
  }
  header .logo {
    width: 100%;
    padding-bottom: 15px;
  }
  header .buttons {
    width: 100%;
  }
  header .buttons a {
    padding: 10px;
    font-size: 0.8em;
  }
}
</style>