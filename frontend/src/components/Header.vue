<template>
  <header class="header" role="banner" aria-label="header">
    <div class="groupomania-logo" role="navigation" aria-label="menu principal">
      <router-link to="/publications">
        <img class="groupomania-logo__img" alt="groupomania logo" src="../assets/icon-left-font-monochrome-white.svg">
      </router-link>
    </div>
    <div class="navigation-btn" role="navigation" aria-label="menu de navigation" v-if="logged">
      <router-link v-if="!profil" :to="`/profil/${id()}`">Profil</router-link>
      <router-link v-else to="/publications">Accueil</router-link>
      <a href @click="logOut">Déconnection</a>
    </div>
    <div class="navigation-btn" role="navigation" aria-label="menu de navigation" v-else>
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
  background-color: #2d3f5d;
  justify-content: space-between;
}
.groupomania-logo {
  width: 30%;
  &__img {
    width: 100%;
  }
}
.navigation-btn {
  width: 40%;
  display: flex;
  justify-content: space-evenly;
  & a {
    padding: 3%;
    border: 2px solid;
    border-radius: 50px;
    background: white;
    font-size: 20px;
    font-weight: bolder;
    text-decoration: none;
    color: black;
  }
}
@media (min-width: 1904px) {
  .navigation-btn a {
    border-radius: 80px;
    font-size: 40px;
  }
}
@media (min-width: 600px) AND (max-width: 960px) {
  .navigation-btn a {
    font-size: 15px;
  }
}
@media (max-width: 600px) {
  .groupomania-logo {
    padding: 1%;
    width: 40%;
  }
  .navigation-btn {
    display: none;
  }
}
</style>