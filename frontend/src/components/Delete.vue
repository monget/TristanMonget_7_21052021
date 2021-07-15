<template>
  <div class="background">
      <div @submit.prevent="handleSubmit(postPublication)" class="delete">
        <div class="delete__title">
          Cette opération est définitive !
        </div>
        <p class="delete__message">Vous confirmez la suppresion de votre {{ message }} ?</p>
        <div class="delete__footer">
          <button @click="close()">
            <img src="../assets/icons/times-solid-red.svg">
          </button>
          <button @click="deleted(msg)">
            <img src="../assets/icons/check-solid.svg">
          </button>
        </div>
      </div>
  </div>
</template>

<script>
import UserDataService from "../services/UserDataService";
import PublicationDataService from "../services/PublicationDataService";
//import CommentDataService from "../services/CommentDataService";

export default {
  name: 'Publish',
  props: {
    id: Number,
    message: String
  },
  methods: {
    deleted(value) {
      if (value == 'profil') {
        UserDataService.delete(this.$route.params.id)
          .then(
            UserDataService.logout(),
            this.$router.push('/connection')
          )
          .catch(e => {
            console.log(e);
          });
      }
      else if (value == 'publication') {
        PublicationDataService.delete(this.id)
          .then(
            this.$emit('delete-publication'),
            this.$emit('closing-popup-delete', false)
          )
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
  top: 0px;
  display: grid;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #ffffffcc;
}
.delete {
  font-family: "Roboto-Regular";
  padding: 2% 2% 1%;
  width: 47%;
  margin: auto;
  border: 1px solid #00000050;
  background-color: white;
  border-radius: 30px;
  &__title {
    padding: 6%;
    background-color: rgba(236, 235, 235, 1);
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.50);
    font-size: 35px;
    color: #FF0000;
    text-align: center;
  }
  &__message {
    font-size: 28px;
    text-align: center;
  }
  &__footer {
    display: flex;
    justify-content: space-around;
    & button {
      cursor: pointer;
      border: none;
      background-color: white;
      & img {
        height: 47px;
      }
    }
  }
}

@media (max-width: 425px) {
  .published__form {
    padding: 5%;
    width: 65%;
  }
}
</style>