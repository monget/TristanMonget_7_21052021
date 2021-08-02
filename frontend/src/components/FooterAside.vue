<template>
  <footer :class="isAside ? 'aside-footer' : 'footer'" aria-label="footer">
    <div :class="isAside ? 'aside-footer-wrap' : 'footer-wrap'">
      <nav>
        <ul :class="isAside ? 'aside-footer-link' : 'footer-link'">
          <li><router-link to="conditions">Conditions générales</router-link></li>
          <li><router-link to="confidentialité">Confidentialité</router-link></li>
          <li><router-link to="contact">Contact</router-link></li>
        </ul>
      </nav>
      <nav>© Groupomania 2021</nav>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterAside',
  data() {
    return {
      isAside: false,
    }
  },
  watch: {
    $route() {
      const pathName = ['Publications', 'Publication', 'Profil']
      const authRequired = pathName.includes(this.$route.name);
      if (authRequired) {
        return this.isAside = true
      }
      else {
        return this.isAside = false
      }
    }
  }
}
</script>

<style lang="scss">
.footer {
  font-size: 23px;
  background-color: white;
}
.footer-wrap {
  display: flex;
  padding: 20px;
  justify-content: space-between;
  & nav:nth-child(1) {
    width: 70%;
  }
  & nav:nth-child(2) {
    width: 30%;
    text-align: end;
  }
}
.footer-link {
  display: flex;
  justify-content: space-between;
  margin: 0px;
  padding-left: 0px;
    & > li {
    list-style-type: none;
    margin-bottom: 15px;
    & a {
      color: black;
      text-decoration: none;
    }
  }
}
.aside-footer {
  position: fixed;
  width: 25%;
  height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  right: 10%;
  top: 15%;
  font-weight: 400;
  font-size: 23px;
  background-color: white;
}
.aside-footer-wrap {
  display: flex;
  flex-direction: column;
  padding: 20px;
  justify-content: space-between;
  height: 100%;
}
.aside-footer-link {
  margin: 0px;
  padding-left: 0px;
    & > li {
    list-style-type: none;
    margin-bottom: 15px;
    text-align: left;
    & a {
      color: black;
      text-decoration: none;
    }
  }
}
@media (min-width: 1904px) {
  .footer {
    font-size: 40px;
  }
  .aside-footer {
    font-size: 40px;
    &-wrap {
      padding: 25px;
      & nav:nth-child(1) {
        height: 55%;
      }
    }
    &-link{
      justify-content: space-between;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
@media (min-width: 960px) AND (max-width: 1264px) {
  .footer {
    font-size: 20px;
  }
  .aside-footer {
    width: 30%;
    height: 25%;
    right: 5%;
    font-size: 20px;
  }
}
@media (min-width: 600px) AND (max-width: 960px) {
  .footer {
    font-size: 15px;
  }
  .aside-footer {
    width: 30%;
    right: 5%;
    font-size: 20px;
    &-wrap {
      padding: 10px;
      font-size: 17px;
    }
  }
}
@media (max-width: 600px) {
  .footer {
    font-size: 13px;
  }
  .footer-wrap {
    padding: 10px;
    & nav:nth-child(1) {
        width: 50%;
    }
    & nav:nth-child(2) {
      width: 50%;
      align-self: flex-end;
    }
  }
  .footer-link {
    height: 70px;
    flex-direction: column;
    & > li {
      margin: 0;
    }
  }
  .aside-footer {
    display: none;
  }
}
</style>