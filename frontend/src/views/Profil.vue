<template>
  <main class="main" role="main" aria-label="main">
    <Delete
      role="dialog"
      aria-label="popup supprimer le profil"
      v-if="showDelete"
      message="profil"
      @closing-popup-delete="closeDelete($event)"
    />
    <div class="profil-wrap" role="article" aria-label="profil" v-if="!editProfil">
      <div class="profil-content">
        <div>
          <img class="profil-avatar profil-avatar--display" :alt="'avatar ' + user.pseudo" :src="displayFile()">
        </div>
        <div class="profil-information" aria-label="information sur le profil">
          <div class=information-content aria-label="pseudo">
            <p class="information-content__name">Pseudo :</p>
            <p class="information-content__value">{{ user.pseudo }}</p>
          </div>
          <div class=information-content aria-label="email">
            <p class="information-content__name">Email :</p>
            <a class="information-content__value information-content__value--color" :href="`mailto:${user.email}`">{{ user.email }}</a>
          </div>
          <div class=information-content aria-label="date de naissance">
            <p class="information-content__name">Date de naissance :</p>
            <p class="information-content__value">{{ user.birthday ? reverseDate(user.birthday) : "../../.." }}</p>
          </div>
        </div>
        <button class="edit-profil" aria-label="modifier le profil" v-if="User(user.id)" @click="showEdit">Modifier le profil</button>
      </div>
    </div>
    <div class="profil-wrap" v-else>
      <ValidationObserver ref="form" v-slot="{ handleSubmit }">
        <form role="form" aria-label="formulaire du profil" @submit.prevent="handleSubmit(postProfil)">
          <div class="profil-content">
            <div class="profil-avatar profil-avatar--txt-align profil-avatar--bg" aria-label="Choisir un avatar">
              <img class="profil-avatar__img" :alt="'avatar ' + user.pseudo" :src="displayFile()">
              <label class="profil-avatar__label" aria-label="modifier l'avatar" for="file"> {{ user.avatar || image ? 'Modifier' : 'Ajouter' }} </label>
              <input class="profil-avatar__input" @change="fileSelected" type="file" name="file" id="file"/>
            </div>
            <div class="profil-information">
              <div class="information-wrap" aria-label="information sur le profil">
                <ValidationProvider vid="user" name="pseudo" rules="required:@pseudo|min:3|max:12" v-slot="{ errors }">
                  <div class="information-content" aria-label="changer le pseudo">
                    <label class="information-content__name" for="pseudo">Pseudo :</label>
                    <input class="information-content__value" name="pseudo" id="pseudo" aria-describedby="pseudo_error" aria-required="true" v-model="user.pseudo"/>
                  </div>
                  <span class="information-content__error" aria-label="indique si il y une erreur" id="pseudo_error">{{ errors[0] }}</span>              
                </ValidationProvider>
                <ValidationProvider vid="email" name="email" rules="required:@email|email" v-slot="{ errors }">
                  <div class="information-content" aria-label="changer l'email">
                    <label class="information-content__name" for="email">Email :</label>
                    <input class="information-content__value" type="email" name="email" id="email" aria-describedby="email_error" aria-required="true" v-model="user.email"/>
                  </div>
                  <span class="information-content__error" aria-label="indique si il y une erreur" id="email_error">{{ errors[0] }}</span>              
                </ValidationProvider>
                <ValidationProvider vid="birthday" name="birthday" v-slot="{ errors }">
                  <div class="information-content" aria-label="ajouter ou modifier la date de naissance">
                    <label class="information-content__name" for="birthday">Date de naissance :</label>
                    <input class="information-content__value" type="date" id="birthday" min="1950-01-01" max="2005-01-01" aria-describedby="birthday_error" v-model="user.birthday"/>
                  </div>
                  <span class="information-content__error" aria-label="indique si il y une erreur" id="birthday_error">{{ errors[0] }}</span>              
                </ValidationProvider>
              </div>
              <button class="edit-profil" aria-label="valider les modifications" type="submit">Valider</button>
            </div>
          </div>
        </form>
      </ValidationObserver>    
    </div>
    <aside class="delete-profil" role="complementary" aria-label="supprimer le profil">
      <button class="delete-profil__btn" v-if="rules(user.id)" @click="showDeleted()">Supprimer le profil</button>
    </aside>
  </main>
</template>

<script>
import Delete from '@/components/Delete.vue'
import UserDataService from "../services/UserDataService";

export default {
  name: "Profil",
    components: {
    Delete
  },
  data() {
    return {
      user: [],
      image: null,
      showDelete: false,
      editProfil: false
    };
  },
  watch: {
    $route() {
      this.setup(this.$route.params.id);
    }
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
    postProfil() {
      const data = new FormData();
      if (this.image != null) {
        data.append('image', this.image, this.image.name)
      }
      data.append('pseudo', this.user.pseudo)
      data.append('email', this.user.email)
      if (this.user.birthday != null) {
        data.append('birthday', this.user.birthday)
      }
      UserDataService.update(this.user.id, data)
        .then(
          this.editProfil = false,
          this.$store.commit('CHANGE_AVATAR', this.url)
        )
        .catch(e => {
          this.$refs.form.setErrors(e.response.data)
        });
    },
    reverseDate(date) {
      return date.split("-").reverse().join('/')
    },
    fileSelected(event) {
      this.image = event.target.files[0]
    },
    displayFile() {
      if (this.image != null) {
        return this.url = URL.createObjectURL(this.image)
      }
      return this.user.avatar
    },
    User(userid) {
      if (localStorage.user) {
        let user = JSON.parse(localStorage.getItem('user'))
        if (user.Id === userid) {
          return true
        }
      }
      return false
    },
    rules(userId) {
      let user = JSON.parse(localStorage.getItem('user'))
      if (user.isAdmin === true && user.Id === userId) {
        return false
      }
      else if (user.isAdmin === true && user.Id !== userId) {
        return true
      }
      else if (user.Id === userId) {
        return true
      }
    },
    showEdit() {
      return this.editProfil = true;
    },
    showDeleted() {
      return this.showDelete = true;
    },
    closeDelete(condition) {
      return this.showDelete = condition;
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
.profil-wrap {
  font-family: "Roboto-Medium";
  padding-top: 50px;
  padding-bottom: 50px;
  padding-left: 30px;
}
.profil-content {
  font-size: 30px;
  padding: 0 2% 2%;
  width: 55%;
  background-color: white;
  border-radius: 30px;
  border: 1px solid;
}
.profil-avatar {
  object-fit: cover;
  border-radius: 100px;
  border: 1px solid #2d3f5d;
  background-color: #2d3f5d;
  width: 150px;
  height: 150px;
  margin: 2% 0 0 auto;
  &--display {
    display: flex;
  }
  &--txt-align {
    text-align: center;
  }
  &--bg {
    background-color: #ecebeb;
  }
  &__img {
    width: 150px;
    height: 150px;
    border-radius: 100px;
    object-fit: cover;
  }
  &__label {
    cursor: pointer;
  }
  &__input {
    position: absolute;
    left: -99999rem;
  }
}
.profil-information {
  display: block;
  margin-top: -25px;
}
.information-wrap {
  width: 70%;
}
.information-content {
  display: flex;
  align-items: center;
  &__name {
    margin: 10px 0;
  }
  &__value {
    margin: 10px 0 10px 10px;
    &--color {
      color: black;
    }
  }
  & input {
    flex: 1;
    width: 20%;
    font-size: 30px;
    font-family: 'Roboto-Medium';
    background-color: #ecebeb;
    border-width: 1px;
  }
  &__error {
    color: red;
    font-size: 25px;
    white-space: nowrap;
  }
}
.edit-profil {
  cursor: pointer;
  font-family: "Roboto-Medium";
  font-size: 25px;
  display: block;
  width: 35%;
  margin: 50px auto;
  font-weight: bold;
  color: white;
  background-color: #2d3f5d;
}
.delete-profil {
  position: fixed;
  right: 10%;
  top: 50%;
  font-weight: 400;
  width: 25%;
  &__btn {
    width: 100%;
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
a {
  text-decoration: none;
  color: white;
}
@media (min-width: 1904px) {
  .profil-wrap {
    padding-top: 150px;
    padding-left: 150px;
  }
  .profil-content {
    width: 50%;
  }
  .profil-avatar {
    border-radius: 250px;
    width: 250px;
    height: 250px;
    &__img {
      border-radius: 250px;
      width: 250px;
      height: 250px;
    }
    &__label {
      font-size: 40px;
    }
  }
  .profil-information {
    font-size: 50px;
    margin: 0;
  }
  .information-content {
    &__name {
      margin: 20px 0;
    }
    &__value {
      margin: 20px 0 20px 10px;
    }
    & input {
      font-size: 50px;
    }
  }
  .edit-profil {
    font-size: 40px;
    margin: 80px auto;
  }
  .delete-profil__btn {
    font-size: 40px;
  }
}
@media (min-width: 1264px) AND (max-width: 1904px) {
  .profil-information {
    margin-top: 20px;
  }
}
@media (min-width: 960px) AND (max-width: 1264px) {
  .profil-avatar {
    width: 120px;
    height: 120px;
    &__img {
      width: 120px;
      height: 120px;
    }
    &__label {
      font-size: 25px;
    }
  }
  .profil-information {
    margin-top: 55px;
    font-size: 25px;
  }
  .information-wrap {
    width: 80%;
  }
  .information-content {
    font-size: 25px;
    & input {
      font-size: 25px;
    }
  }
  .edit-profil {
    font-size: 20px;
    width: 40%;
  }
  .delete-profil {
    right: 5%;
    width: 30%;
    &__btn {
      font-size: 25px;
    }
  }
}
@media (min-width: 600px) AND (max-width: 960px) {
  .profil-avatar {
    width: 100px;
    height: 100px;
    &__img {
      width: 100px;
      height: 100px;
    }
    &__label {
      font-size: 17px;
    }
  }
  .profil-information {
    margin-top: 55px;
    font-size: 20px;
  }
  .information-wrap {
    width: 90%;
  }
  .information-content {
    font-size: 20px;
    & input {
      font-size: 20px;
    }
  }
  .edit-profil {
    font-size: 15px;
    width: 35%;
  }
  .delete-profil {
    right: 5%;
    width: 30%;
    &__btn {
      font-size: 18px;
    }
  }
}
@media (max-width: 600px) {
  .profil-wrap {
    padding-top: 30px;
    padding-bottom: 50px;
    padding-left: 0;
  }
  .profil-content {
    width: 90%;
    margin: auto;
  }
   .profil-avatar {
    width: 90px;
    height: 90px;
    &__img {
      width: 90px;
      height: 90px;
    }
    &__label {
      font-size: 15px;
    }
  }
  .profil-information {
    margin-top: 55px;
    font-size: 15px;
  }
  .information-wrap {
    width: 100%;
  }
  .information-content {
    font-size: 15px;
    & input {
      font-size: 15px;
    }
  }
  .edit-profil {
    font-size: 13px;
    width: 35%;
  }
  .delete-profil {
    margin: auto;
    position: initial;
    width: 55%;
    &__btn {
      font-size: 14px;
    }
  }
}
</style>