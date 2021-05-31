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
      padding: 15px;
      border: 1px solid;
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
  header .buttons {
    display: block;
  }
  header button {
    width: 100%
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
</style>
