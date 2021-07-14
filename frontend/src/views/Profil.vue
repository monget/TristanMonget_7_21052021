<template>
  <main>
    <div class="profil">
      <div class="profil__wrap">
          <div>
            <img class="avatar" :src="user.avatar">
          </div>
          <div class="information">
            <div class=information__content>
              <p class="information__name">Pseudo :</p>
              <p class="information__value">{{ user.pseudo }}</p>
            </div>
            <div class=information__content>
              <p class="information__name">Email :</p>
              <p class="information__value">{{ user.email }}</p>
            </div>
            <div class=information__content>
              <p class="information__name">Date de naissance :</p>
              <p class="information__value">../../..</p>
            </div>
            <div class=information__content>
              <p class="information__name">Poste occupé :</p>
              <p class="information__value"></p>
            </div>
            <p class="information__name">Descriptif :</p>
            <textarea></textarea>
            <button v-if="access(user.id)" class="editProfil"><router-link to="/profil">Modifier le profil</router-link></button>
          </div>
      </div>
    </div>
    <aside>
      <button v-if="access(user.id)" @click="deleteUser(user.id)">Supprimer le profil</button>
    </aside>
  </main>
</template>

<script>
import UserDataService from "../services/UserDataService";

export default {
  name: "Profil",
  data() {
    return {
      user: []
    };
  },
  beforeMount() {
    this.setup(this.$route.params.id);
  },
  methods: {
    setup(id) {
      UserDataService.find(id)
        .then(response => {
          this.user = response.data
        })
        .catch(e => {
          console.log(e);
        });
    },
    access(userid) {
      if (localStorage.user) {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user.Id === userid) {
          return true
        }
      }
      return false
    },
    deleteUser(id) {
      UserDataService.delete(id)
        .then(
          UserDataService.logout(),
          this.$router.push('/')
        )
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>


<style lang="scss" scoped>
@font-face {
  font-family: "Roboto-Medium";
  src: local("Roboto-Medium"),
  url(../fonts/Roboto-Medium.ttf) format("truetype");
}
.profil {
  font-family: "Roboto-Medium";
  padding-top: 50px;
  padding-bottom: 50px;
  padding-left: 30px;
  &__wrap {
    font-size: 30px;
    padding: 0 2% 2%;
    width: 55%;
    background-color: white;
    border-radius: 30px;
    border: 1px solid;
  }
}
.avatar {
  display: flex;
  object-fit: cover;
  border-radius: 100px;
  border: 1px solid;
  width: 150px;
  height: 150px;
  margin: 2% 0 0 auto;
}
.information {
  display: block;
  margin-top: -35px;
  &__content {
    display: flex;
  }
  &__name {
    margin: 10px 0;
  }
  &__value {
    margin: 10px 0 10px 10px;
  }
}
textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 20px;
  box-sizing: border-box;
  background-color: #ecebeb;
}
.editProfil {
  font-family: "Roboto-Medium";
  font-size: 25px;
  display: block;
  width: 35%;
  margin: auto;
  font-weight: bold;
  color: white;
  background-color: #3B47B2;
}
a {
  text-decoration: none;
  color: white;
}
@media (max-width: 425px) {
  .profil__wrap {
    padding: 5%;
    width: 65%;
  }
}
aside {
  position: fixed;
  right: 15%;
  top: 50%;
  font-weight: 400;
  & button {
    cursor: pointer;
    padding: 20px 24px;
    background-color: #C71010;
    border: 2px solid white;
    font-family: "Roboto-Medium";
    font-size: 30px;
    margin: auto;
    color: white;
  }
}
</style>