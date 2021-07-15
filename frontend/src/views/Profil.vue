<template>
  <main>
    <Delete msg="profil" v-on:closingPopupDelete="close($event)" v-if="showDelete"/>
    <div v-if="!editProfil" class="profil">
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
          <p class="description"></p>
          <button v-if="access(user.id)" @click="showEdit" class="editProfil">Modifier le profil</button>
        </div>
      </div>
    </div>
    <div v-else class="profil">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(postProfil)">
          <div class="profil__wrap">
            <div class="change__avatar">
              <img :src="user.avatar">
              <label for="file">Modifier</label>
              <input @change="fileSelected" type="file" name="file" id="file" class="inputfile" />
            </div>
            <div class="information">
              <div class="information__wrap">
                <ValidationProvider class=information__content vid="comment" name="pseudo" v-slot="{ errors }">
                  <label class="information__name" for="pseudo">Pseudo :</label>
                  <input class="information__value" name="pseudo" v-model="user.pseudo" />
                  <span class="content__error">{{ errors[0] }}</span>              
                </ValidationProvider>
                <ValidationProvider class=information__content vid="comment" name="email" v-slot="{ errors }">
                  <label class="information__name" for="email">Email :</label>
                  <input class="information__value" name="email" v-model="user.email" />
                  <span class="content__error">{{ errors[0] }}</span>              
                </ValidationProvider>
                <div class=information__content>
                  <label class="information__name" for="birthday">Date de naissance :</label>
                  <input class="information__value" />
                </div>
                <div class=information__content>
                  <label class="information__name" for="positionHeld">Poste occupé :</label>
                  <input class="information__value" />
                </div>
              </div>
              <p class="information__name">Descriptif :</p>
              <textarea></textarea>
              <button v-if="access(user.id)" class="editProfil">Valider</button>
            </div>
          </div>
        </form>
      </ValidationObserver>
    </div>
    <aside>
      <button v-if="access(user.id)" @click="deleted()">Supprimer le profil</button>
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
      showDelete: false,
      editProfil: false
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
    postProfil() { // A finir pour modifier le profil
      const data = new FormData();
      if (this.image != null) {
        data.append('image', this.image, this.image.name)
      }
      data.append('message', this.message)
      UserDataService.create(data)
        .then(response => {
          if (response) {
            this.$emit('closingPopupDelete', false)
          }
        })
        .catch(e => {
          this.$refs.error.setErrors([e.response.data.message])
        });
    },
    fileSelected(event) {
      this.image = event.target.files[0]
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
    showEdit() {
      return this.editProfil = true;
    },
    deleted() {
      return this.showDelete = true;
    },
    close(condition) {
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
    width: 150px;
    height: 150px;
    object-fit: cover;
  }
  & label {
    cursor: pointer;
  /*  color: white;
    position: relative;
    top: -70%;*/
  }
  & input {
    display: none;
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
  border: 1px solid;
  width: 150px;
  height: 150px;
  margin: 2% 0 0 auto;
}
.information {
  display: block;
  margin-top: -35px;
  &__wrap {
    width: 55%;
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
  }
}
textarea, .description {
  width: 100%;
  height: 100px;
  margin-bottom: 20px;
  box-sizing: border-box;
  background-color: #ecebeb;
}
.editProfil {
  cursor: pointer;
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