<template>
  <div class="background">
    <div>
      <button class="close" @click="close()">
            <img src="../assets/icons/times-solid.svg">
      </button>
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(postPublication)" class="form">
          <div class="form__wrap">
            <ValidationProvider ref="error" vid="comment" name="comment" v-slot="{ errors }">
              <label class="content__title" for="comment">Commentaire :</label>
              <textarea class="content__textarea" type="text" id="comment" name="comment" v-model="message"/>
              <span class="content__error">{{ errors[0] }}</span>
            </ValidationProvider>
            <div class="footer__wrap">
              <div class="add_file">
                <label for="file">Ajouter <img src="../assets/icons/file-image-regular.svg"></label>
                <input @change="fileSelected" type="file" name="file" id="file" class="inputfile" />
              </div>
              <div><button class="validate"><img src="../assets/icons/paper-plane-regular.svg"></button></div>
            </div>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import PublicationDataService from "../services/PublicationDataService";

export default {
  name: 'Publish',
  data() {
    return {
      message: "",
      image: null
    };
  },
  methods: {
    postPublication() {
      const data = new FormData();
      if (this.image != null) {
        data.append('image', this.image, this.image.name)
      }
      data.append('message', this.message)
      PublicationDataService.create(data)
        .then(response => {
          if (response) {
            this.$emit('closingPopup', false)
          }
        })
        .catch(e => {
          this.$refs.error.setErrors([e.response.data.message])
        });
    },
    fileSelected(event) {
      this.image = event.target.files[0]
    },
    close() {
      this.$emit('closingPopup', false);
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
.close {
  display: flex;
  width: 44px;
  cursor: pointer;
  top: 30px;
  left: 73.5%;
  position: relative;
  background-color: black;
  border: none;
  border-radius: 64px;
  & img {
    width: 35px;
    height: 42px;
  }
}
.form {
  font-size: 20px;
  padding: 2%;
  width: 47%;
  margin: auto;
  border: 1px solid #00000050;
  background-color: white;
  border-radius: 30px;
  &__wrap {
    font-family: "Roboto-Regular";
    padding: 4%;
    background-color: rgba(236, 235, 235, 1);
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.50);
  }
}
.content {
  &__title {
  font-size: 26px;
  display: block;
  margin: 10px 0px;
  color: #909090;
  }
  &__textarea {
    font-family: "Roboto-Regular";
    font-size: 20px;
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
    box-sizing: border-box;
    height: 130px;
  }
  &__error {
    display: block;
    text-align: center;
    font-size: 26px;
    color: red;
  }
}
.footer__wrap {
  margin: 25px 0px 0px;
  display: flex;
  justify-content: space-between;
}
.add_file {
  color: #577DDD;
  font-size: 30px;
  & label {
    cursor: pointer;
    display: flex;
    align-items: center;
    & img {
      width: auto;
      height: 47px;
      margin-left: 15px;
    }
  }
  & input {
    display: none;
  }
}
.validate {
  cursor: pointer;
  border: none;
  padding: 0;
  background-color: #ecebeb;
  & img {
    height: 47px;
  }
}
@media (max-width: 425px) {
  .published__form {
    padding: 5%;
    width: 65%;
  }
}
</style>