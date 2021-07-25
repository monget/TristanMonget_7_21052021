<template>
  <header role="banner" aria-label="header" class="header">
    <div role="navigation" aria-label="menu principal" class="logo">
      <router-link to="/publications">
        <img alt="logo Groupomania" src="../assets/icon-left-font-monochrome-white.svg">
      </router-link>
    </div>
    <div role="navigation" aria-label="menu de navigation" class="buttons" v-if="logged">
      <router-link v-if="!profil" :to="`/profil/${id()}`">Profil</router-link>
      <router-link v-else to="/publications">Accueil</router-link>
      <a href @click="logOut">Déconnection</a>
    </div>
    <div role="navigation" aria-label="menu de navigation" class="buttons" v-else>
      <router-link to="/registration">Inscription</router-link>
      <router-link to="/connection">Connection</router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      profil: ''
    }
  },
  computed: {
    logged() {
      if (this.$store.state.auth.status.loggedIn) {
        return true
      }
      return false
    }
  },
  watch: {
    $route() {
      if (this.$store.state.auth.status.loggedIn) {
        if (this.$route.path === `/profil/${this.$store.state.auth.user.Id}`) {
          return this.profil = true
        }
        else {
          return this.profil = false
        }
      }
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/connection');
    },
    id() {
      return this.$store.state.auth.user.Id
    }
  }
}
</script>

<style lang="scss">
.header {
  padding-left: 5px;
  display: flex;
  align-items: center;
  border: 1px solid #2d3f5d;
  background-color: #2d3f5d;
  justify-content: space-between;
  & .logo {
    width: 30%;
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
  .head {
    flex-direction: column;
    & .logo {
      width: 100%;
      padding-bottom: 15px;
    }
    & .buttons {
      width: 100%;
      & a {
        padding: 10px;
        font-size: 0.8em;
      }
    }
  }
}
</style>