<template>
  <div class="background">
    <FocusLoop :is-visible="activeTrap">
      <div class="delete-wrap" aria-label="popup de suppression" @submit.prevent="handleSubmit(postPublication)">
        <div class="delete-title" aria-label="opération définitive">
          Cette opération est définitive !
        </div>
        <p class="delete-information">Vous confirmez la suppresion de votre {{ message }} ?</p>
        <div class="delete-footer">
          <button class="delete-btn" aria-label="fermer la fenêtre de suppression" @click="close()">
            <img class="delete-btn__img" alt="croix" src="../assets/icons/times-solid-red.svg">
          </button>
          <button class="delete-btn" aria-label="valider la suppression" @click="deleted(message)">
            <img class="delete-btn__img" alt="coche valider verte" src="../assets/icons/check-solid.svg">
          </button>
        </div>
      </div>
    </FocusLoop>
  </div>
</template>

<script>
import UserDataService from "../services/UserDataService";
import PublicationDataService from "../services/PublicationDataService";
import CommentDataService from "../services/CommentDataService";
import { FocusLoop } from '@vue-a11y/focus-loop'

export default {
  name: 'Publish',
  components: {
    FocusLoop
  },
  props: {
    id: Number,
    message: String
  },
  data() {
    return {
      activeTrap: true
    }
  },
  methods: {
    deleted(value) {
      let user = JSON.parse(localStorage.getItem('user'))
      if (value == 'profil') {
        if (user.isAdmin === true && user.Id === this.$route.params.id) {
          alert("Opération interdite !")
        }
        else {
          UserDataService.delete(this.$route.params.id)
            .then(() => {
              if (user.isAdmin !== true) {
                this.$store.dispatch('auth/logout');
                this.$router.push('/connection')
              }
              else {
                this.$emit('closing-popup-delete', false)
                this.$router.push('/publications')
              }
            })
            .catch(e => {
              console.log(e);
            });
        }
      }
      else if (value == 'publication') {
        PublicationDataService.delete(this.id)
          .then(response => {
            if (response.data.disactive === true) {
              this.$emit('disactive-publication', response.data)
              this.$emit('closing-popup-delete', false)
            }
            else {
              this.$emit('delete-publication')
              this.$emit('closing-popup-delete', false)
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
      else if (value == 'commentaire') {
        CommentDataService.delete(this.id)
          .then(response => {
            if (response.data.disactive === true) {
              this.$emit('disactive-comment', response.data)
              this.$emit('closing-popup-delete', false)
            }
            else {
              this.$emit('delete-comment'),
              this.$emit('closing-popup-delete', false)
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
      
    },
    close() {
      this.$emit('closing-popup-delete', false);
    }
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "Roboto-Regular";
  src: local("Roboto-Regular"),
  url(../fonts/Roboto-Regular.ttf) format("truetype");
}
.background {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  display: grid;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #ffffffcc;
}
.delete-wrap {
  font-family: "Roboto-Regular";
  padding: 2% 2% 1%;
  width: 50%;
  margin: auto;
  border: 1px solid #00000050;
  background-color: white;
  border-radius: 30px;
}
.delete-title {
  padding: 6%;
  background-color: rgba(236, 235, 235, 1);
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.50);
  font-size: 35px;
  color: #FF0000;
  text-align: center;
}
.delete-information {
  font-size: 28px;
  text-align: center;
}
.delete-footer {
  display: flex;
  justify-content: space-around;
}
.delete-btn {
  cursor: pointer;
  border: none;
  background-color: white;
  &__img {
    height: 47px;
  }
}
@media (min-width: 1904px) {
  .delete-wrap {
    padding: 1% 1% 1%;
  }
  .delete-title {
    font-size: 60px;
  }
  .delete-information {
    font-size: 45px;
  }
  .delete-btn__img {
    height: 80px;
  }
}
@media (min-width: 960px) AND (max-width: 1264px) {
  .delete-wrap {
    width: 65%;
  }
  .delete-title {
    font-size: 30px;
  }
  .delete-information {
    font-size: 25px;
  }
  .delete-btn__img {
    height: 40px;
  }
}
@media (min-width: 600px) AND (max-width: 960px) {
  .delete-wrap {
    border-radius: 20px;
    width: 65%;
  }
  .delete-title {
    font-size: 25px;
  }
  .delete-information {
    font-size: 20px;
  }
  .delete-btn__img {
    height: 30px;
  }
}
@media (max-width: 600px) {
  .delete-wrap {
    border-radius: 10px;
    width: 90%;
  }
  .delete-title {
    font-size: 18px;
  }
  .delete-information {
    font-size: 14px;
  }
  .delete-btn__img {
    height: 20px;
  }
}
</style>