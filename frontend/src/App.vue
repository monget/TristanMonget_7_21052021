<template>
  <div>
    <header>
      <div class="logo">
        <router-link to="/">
          <img alt="Groupomania logo" src="./assets/icon-left-font-monochrome-black.svg">
        </router-link>
      </div>
      <div class="buttons">
        <router-link to="/registration">s'inscrire</router-link>
        <router-link to="/connection">se connecter</router-link>
      </div>
    </header>
    <router-view/>
    <footer>
      <nav>
          <h2>Plan du site</h2>
          <ul>
              <li><a href="#">Navigation</a></li>
              <li><a href="#">Qui nous sommes</a></li>
              <li><a href="#">Nos autres sites</a></li>
          </ul>
      </nav>
      <nav>
          <h2>Contact</h2>
          <ul>
              <li><a href="#">E-mail</a></li>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
          </ul>
      </nav>
      <nav id="copyright">©Copyright 2021 par Tristan Monget. Tous droits réservés.</nav>
    </footer>
  </div>
</template>

<style lang="scss">
body {
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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

footer {
  width: 100%;
  display: flex;
  left: 0;
  right: 0;
  bottom: 0;
  color: white;
  justify-content: space-around;
  background-color: grey;
  padding-top: 15px;
  & h2 {
    margin-block-start: 0px;
  }
  & ul {
    padding-left: 0px;
    list-style-type: none;
  }
  & ul > li {
    list-style-type: none;
    text-align: left;
    & a {
    color: white;
    text-decoration: none;
}
  }
}
</style>
