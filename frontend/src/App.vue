<template>
  <div>
    <header>
      <div class="logo">
        <router-link to="/">
          <img alt="Groupomania logo" src="./assets/icon-left-font-monochrome-black.svg">
        </router-link>
      </div>
      <div v-if="connection == false" class="buttons">
        <router-link to="/registration">Inscription</router-link>
        <router-link to="/connection">Connection</router-link>
      </div>
      <div v-else @click.prevent="logOut" class="buttons">
        <router-link to="/connection">Déconnection</router-link>
      </div>
    </header>
    <router-view/>
    <footer>
      <nav>
        <ul>
          <li><a href="#">Conditions générales</a></li>
          <li><a href="#">Confidentialité</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
      <nav id="copyright">© Groupomania 2021</nav>
    </footer>
  </div>
</template>

<script>
//import router from "./router";

export default {
  name: "App",
  data() {
    return {
      connection: false
    }
  },
  mounted() {
    if(localStorage.user)
      return this.connection= true
  },
  methods: {
    logOut() {
      localStorage.removeItem('user');
      //router.push('/connection');
      return this.connection= false
    }
  }
}
</script>


<style lang="scss">
@font-face {
  font-family: "Roboto-Thin";
  src: local("Roboto-Thin"),
  url(./fonts/Roboto-Thin.ttf) format("truetype");
}
body {
  background-color: rgba(209, 209, 209, 0.65);
  font-family: "Roboto-Thin";
  width: 100%;
  margin: 0;
}
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
footer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  height: 200px;
  right: 15%;
  top: 25%;
  font-weight: 400;
  font-size: 20px;
  padding: 20px 80px 20px 30px;
  background-color: white;
  & ul {
    margin: 0px;
    padding-left: 0px;
  }
  & ul > li {
    list-style-type: none;
    margin-bottom: 15px;
    text-align: left;
    & a {
    color: black;
    text-decoration: none;
}
  }
}
</style>

