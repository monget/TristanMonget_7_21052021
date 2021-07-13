<template>
  <div class="published">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(postPublication)" class="published__form">
        <div class="content">

          <ValidationProvider ref="error" vid="comment" name="comment" v-slot="{ errors }">
            <label class="label" for="comment">Commentaire :</label>
            <textarea class="textarea" type="text" id="comment" name="comment" v-model="message"/>
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>

          <div class="content__footer">
            <div>
              <label for="file">Ajouter <img src="../assets/icons/file-image-regular.svg"></label>
              <input @change="fileSelected" type="file" name="file" id="file" class="inputfile" />
            </div>
            <div><button><img src="../assets/icons/paper-plane-regular.svg"></button></div>
          </div>
        </div>
      </form>
    </ValidationObserver>
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
          console.log(response)
        })
        .catch(e => {
          this.$refs.error.setErrors([e.response.data.message])
        });
    },
    fileSelected(event) {
      this.image = event.target.files[0]
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
.published {
  position: fixed;
  z-index: 999;
  top: 0px;
  display: grid;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #ffffffcc;
  &__form {
    font-size: 20px;
    padding: 2%;
    width: 47%;
    margin: auto;
    border: 1px solid #00000050;
    background-color: white;
    border-radius: 30px;
  }
}
@media (max-width: 425px) {
  .published__form {
    padding: 5%;
    width: 65%;
  }
}
.content {
  font-family: "Roboto-Regular";
  padding: 4%;
  margin: 0px;
  background-color: rgba(236, 235, 235, 1);
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.50);
  & .error {
    text-align: center;
    font-size: 25px;
    color: red;
  }
  &__footer {
    margin: 20px 0px 0px;
    & label {
      display: flex;
      align-items: center;
      margin-right: 10px;
    }
    & div {
      padding: 0;
      cursor: pointer;
      color: #577DDD;
      font-size: 30px;
      border: none;
      background-color: #ecebeb;
      & button {
        border: none;
        padding: 0;
        background-color: #ecebeb;
      }
      & input {
        display: none;
      }
    }
    & img {
      width: auto;
      height: 47px;
      margin-right: 0px;
      margin-left: 15px;
    }
  }
}
.label {
  font-size: 26px;
  display: block;
  margin: 10px 0px;
  text-align: left;
  color: #909090;
}
.input {
  font-size: 20px;
  width: 100%;
  display: block;
  padding: 5px;
  margin-bottom: 10px;
  box-sizing: border-box;
}
.textarea {
  font-family: "Roboto-Regular";
  font-size: 20px;
  width: 100%;
  display: block;
  padding: 5px;
  margin-bottom: 10px;
  box-sizing: border-box;
  height: 130px;
}
a {
  text-decoration: none;
  color: blue;
}
span {
  display: block;
}
</style>