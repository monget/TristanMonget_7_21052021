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
    <div class="navigation-mobile" role="navigation" aria-label="menu principal">
      <button class="access-navigation" aria-label="Ouvrir le menu de navigation" @click="showNavigation()">
        <img class="access-navigation__img" alt="logo du menu de navigation" src="../assets/icons/home-solid.svg">
      </button>
      <div class="navigation-menu" v-if="navigationMenu">
        <p aria-label="pseudo de l'utilisateur" v-if="logged"> {{ this.$store.state.auth.user.pseudo}} </p>
        <div class="navigation-menu-btn" role="navigation" aria-label="menu de navigation" v-if="logged">
          <router-link v-if="!profil" :to="`/profil/${id()}`" @click.native="showNavigation()">Profil</router-link>
          <router-link v-else to="/publications" @click.native="showNavigation()">Accueil</router-link>
          <a href @click="logOut">Déconnection</a>
        </div>
        <div class="navigation-menu-btn" role="navigation" aria-label="menu de navigation" v-else>
          <router-link to="/registration" @click.native="showNavigation()">Inscription</router-link>
          <router-link to="/connection" @click.native="showNavigation()">Connection</router-link>
        </div>
        <ul>
          <li><router-link to="conditions" @click.native="showNavigation()">Conditions générales</router-link></li>
          <li><router-link to="confidentialité" @click.native="showNavigation()">Confidentialité</router-link></li>
          <li><router-link to="contact" @click.native="showNavigation()">Contact</router-link></li>
        </ul>
        <span>© Groupomania 2021</span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      profil: '',
      navigationMenu: false
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
    },
    showNavigation() {
      if (this.navigationMenu == false) {
        return this.navigationMenu = true
      }
      else {
        return this.navigationMenu = false
      }
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
.navigation-mobile {
  display: none;
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
  .navigation-mobile {
    display: flex;
    flex-direction: column;
  }
  .access-navigation {
    border: none;
    background-color: #2d3f5d;
    &__img {
      width: 25px;
    }
  }
  .navigation-menu {
    position: absolute;
    top: 5%;
    right: 0;
    background: #b5cff9;
    z-index: 99;
    border: 5px solid white;
    padding: 3%;
    font-size: 15px;
    border-radius: 10px;
    & p {
      text-align: center;
    }
    & a {
      margin-top: 15px;
      text-decoration: none;
      color: black;
    }
    & ul {
      list-style-type: none;
      padding: 0;
      margin: 30px 0;
      & li {
        margin: 5px 0;
      }
    }
  }
  .navigation-menu-btn {
    display: flex;
    flex-direction: column;
  }
}
</style>