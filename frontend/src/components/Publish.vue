<template>
  <div class="background">
    <FocusLoop :is-visible="activeTrap">
      <div aria-label="popup de publication">
        <button aria-label="fermer le popup" class="close" @click="close()">
            <img alt="croix" src="../assets/icons/times-solid.svg">
        </button>
        <ValidationObserver v-slot="{ handleSubmit }">
          <form role="form" aria-label="formulaire de publication" @submit.prevent="handleSubmit(postPublication)" class="form">
            <div class="form__wrap">
              <ValidationProvider ref="error" vid="comment" name="comment" v-slot="{ errors }">
                <label class="hiddelabel" for="comment">commentaire</label>
                <textarea aria-label="votre message" class="content__textarea" type="text" id="comment" name="comment" aria-describedby="error" v-model="message"/>
                <span aria-label="affichage des erreurs si la publication est vide" id="error" class="content__error">{{ errors[0] }}</span>
              </ValidationProvider>
              <img class="content__attachement" alt="fichier ajouté" :src="displayFile()" v-if="image"/>
              <div class="footer__wrap">
                <div aria-label="Choisir un fichier" class="add_file">
                  <label for="file"> {{ image ? 'Modifier' : 'Ajouter' }}
                    <img alt="fichier image bleu" src="../assets/icons/file-image-regular.svg">
                  </label>
                  <input @change="fileSelected" type="file" name="file" id="file" class="inputfile" />
                </div>
                <div aria-label="Valider la publication">
                  <button type="submit" class="validate">
                    <img alt="avion en papier vert" src="../assets/icons/paper-plane-regular.svg">
                  </button>
                </div>
              </div>
            </div>
          </form>
        </ValidationObserver>
      </div>
    </FocusLoop>
  </div>
</template>

<script>
import PublicationDataService from "../services/PublicationDataService"
import { FocusLoop } from '@vue-a11y/focus-loop'

export default {
  name: 'Publish',
  components: {
    FocusLoop
  },
  data() {
    return {
      message: "",
      image: null,
      activeTrap: true
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
          this.$emit('add-publication', response.data)
          this.$emit('closing-popup-publish', false)
        })
        .catch(e => {
          this.$refs.error.setErrors([e.response.data.message])
        });
    },
    fileSelected(event) {
      this.image = event.target.files[0]
    },
    displayFile() {
      if (this.image != null) {
        return this.url = URL.createObjectURL(this.image);
      }
    },
    close() {
      this.$emit('closing-popup-publish', false);
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
.hiddelabel {
  display: none;
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
    font-size: 30px;
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
  &__attachement {
    width: 100%;
    height: 400px;
    object-fit: cover;
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
    position: absolute;
    left: -99999rem;
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