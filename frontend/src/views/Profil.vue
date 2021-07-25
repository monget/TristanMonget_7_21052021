<template>
  <main role="main" aria-label="main">
    <Delete
      role="dialog"
      aria-label="popup supprimer le profil"
      v-if="showDelete"
      message="profil"
      @closing-popup-delete="closeDelete($event)"
    />
    <div role="article" aria-label="profil" v-if="!editProfil" class="profil">
      <div class="profil__wrap">
        <div>
          <img class="avatar" :alt="'avatar ' + user.pseudo" :src="displayFile()">
        </div>
        <div aria-label="information sur le profil" class="information">
          <div aria-label="pseudo" class=information__content>
            <p class="information__name">Pseudo :</p>
            <p class="information__value">{{ user.pseudo }}</p>
          </div>
          <div aria-label="email" class=information__content>
            <p class="information__name">Email :</p>
            <a class="information__value information__value--color" :href="`mailto:${user.email}`">{{ user.email }}</a>
          </div>
          <div aria-label="date de naissance" class=information__content>
            <p class="information__name">Date de naissance :</p>
            <p class="information__value">{{ user.birthday ? reverseDate(user.birthday) : "../../.." }}</p>
          </div>
        </div>
        <button aria-label="modifier le profil" v-if="User(user.id)" @click="showEdit" class="editProfil">Modifier le profil</button>
      </div>
    </div>
    <div v-else class="profil">
      <ValidationObserver ref="form" v-slot="{ handleSubmit }">
        <form role="form" aria-label="formulaire du profil" @submit.prevent="handleSubmit(postProfil)">
          <div class="profil__wrap">
            <div aria-label="Choisir un avatar" class="change__avatar">
              <img :alt="'avatar ' + user.pseudo" :src="displayFile()">
              <label aria-label="modifier l'avatar" for="file"> {{ user.avatar || image ? 'Modifier' : 'Ajouter' }} </label>
              <input @change="fileSelected" type="file" name="file" id="file" class="inputfile"/>
            </div>
            <div class="information">
              <div aria-label="information sur le profil" class="information__wrap">
                <ValidationProvider vid="user" name="pseudo" rules="required:@pseudo|min:3|max:12" v-slot="{ errors }">
                  <div aria-label="changer le pseudo" class="information__content">
                    <label class="information__name" for="pseudo">Pseudo :</label>
                    <input class="information__value" name="pseudo" id="pseudo" aria-describedby="pseudo_error" aria-required="true" v-model="user.pseudo"/>
                  </div>
                  <span aria-label="indique si il y une erreur" id="pseudo_error" class="error">{{ errors[0] }}</span>              
                </ValidationProvider>
                <ValidationProvider vid="email" name="email" rules="required:@email|email" v-slot="{ errors }">
                  <div aria-label="changer l'email" class="information__content">
                    <label class="information__name" for="email">Email :</label>
                    <input class="information__value" type="email" name="email" id="email" aria-describedby="email_error" aria-required="true" v-model="user.email"/>
                  </div>
                  <span aria-label="indique si il y une erreur" id="email_error" class="error">{{ errors[0] }}</span>              
                </ValidationProvider>
                <ValidationProvider vid="birthday" name="birthday" v-slot="{ errors }">
                  <div aria-label="ajouter ou modifier la date de naissance" class="information__content">
                    <label class="information__name" for="birthday">Date de naissance :</label>
                    <input class="information__value" type="date" id="birthday" min="1950-01-01" max="2005-01-01" aria-describedby="birthday_error" v-model="user.birthday"/>
                  </div>
                  <span aria-label="indique si il y une erreur" id="birthday_error" class="error">{{ errors[0] }}</span>              
                </ValidationProvider>
              </div>
              <button aria-label="valider les modifications" type="submit" class="editProfil">Valider</button>
            </div>
          </div>
        </form>
      </ValidationObserver>    
    </div>
    <aside role="complementary" aria-label="supprimer le profil">
      <button v-if="rules(user.id)" @click="showDeleted()">Supprimer le profil</button>
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
          if (e.response.status === 404) {
            this.$router.push('/404')
          }
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
        .then( this.editProfil = false )
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
.change__avatar {
  border-radius: 100px;
  border: 1px solid;
  width: 150px;
  height: 150px;
  margin: 2% 0 0 auto;
  text-align: center;
  background-color: #ecebeb;
  & img {
    border-radius: 100px;
    width: 150px;
    height: 150px;
    object-fit: cover;
  }
  & label {
    cursor: pointer;
  }
  & input {
    position: absolute;
    left: -99999rem;
  }
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
  border: 1px solid #2d3f5d;
  background-color: #2d3f5d;
  width: 150px;
  height: 150px;
  margin: 2% 0 0 auto;
}
.information {
  display: block;
  margin-top: -25px;
  &__wrap {
    width: 70%;
  }
  &__content {
    display: flex;
    & input {
      flex: 1;
      width: 20%;
      font-size: 30px;
      font-family: 'Roboto-Medium';
      background-color: #ecebeb;
      border-width: 1px;
    }
  }
  &__name {
    margin: 10px 0;
  }
  &__value {
    margin: 10px 0 10px 10px;
    &--color {
      color: black;
    }
  }
}
.editProfil {
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
.error {
  color: red;
  font-size: 25px;
  white-space: nowrap;
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
  right: 10%;
  top: 50%;
  font-weight: 400;
  & button {
    width: 350px;
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