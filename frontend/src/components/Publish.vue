<template>
  <div class="background">
    <FocusLoop :is-visible="activeTrap">
      <div aria-label="popup de publication">
        <button class="close-popup" aria-label="fermer le popup" @click="close()">
            <img class="close-popup__img" alt="croix" src="../assets/icons/times-solid.svg">
        </button>
        <ValidationObserver v-slot="{ handleSubmit }">
          <form class="form-publish-wrap" role="form" aria-label="formulaire de publication" @submit.prevent="handleSubmit(postPublication)">
            <div class="form-publish-display">
              <ValidationProvider ref="error" vid="comment" name="comment" v-slot="{ errors }">
                <label class="form-publish-display__hidde-label" for="comment">commentaire</label>
                <textarea class="form-publish-display__textarea" aria-label="votre message" type="text" id="comment" name="comment" aria-describedby="error" v-model="message"/>
                <span class="form-publish-display__error" aria-label="affichage des erreurs si la publication est vide" id="error">{{ errors[0] }}</span>
              </ValidationProvider>
              <img class="form-publish-display__attachement" alt="fichier ajouté" :src="displayFile()" v-if="image"/>
              <div class="form-publish-footer">
                <div class="form-publish-add-file" aria-label="Choisir un fichier">
                  <label class="form-publish-add-file__label" for="file"> {{ image ? 'Modifier' : 'Ajouter' }}
                    <img class="form-publish-add-file__img" alt="fichier image bleu" src="../assets/icons/file-image-regular.svg">
                  </label>
                  <input class="form-publish-add-file__input" @change="fileSelected" type="file" name="file" id="file"/>
                </div>
                <div aria-label="Valider la publication">
                  <button class="form-publish-validate" type="submit">
                    <img class="form-publish-validate__img" alt="avion en papier vert" title="valider" src="../assets/icons/paper-plane-regular.svg">
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
.close-popup {
  display: flex;
  width: 44px;
  cursor: pointer;
  top: 30px;
  left: 73.5%;
  position: relative;
  background-color: black;
  border: none;
  border-radius: 64px;
  &__img {
    width: 35px;
    height: 42px;
  }
}
.form-publish-wrap {
  font-size: 20px;
  padding: 2%;
  width: 47%;
  margin: auto;
  border: 1px solid #00000050;
  background-color: white;
  border-radius: 30px;
}
.form-publish-display {
  font-family: "Roboto-Regular";
  padding: 4%;
  background-color: rgba(236, 235, 235, 1);
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.50);
  &__hidde-label {
    display: none;
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
.form-publish-footer {
  margin: 25px 0px 0px;
  display: flex;
  justify-content: space-between;
}
.form-publish-add-file {
  color: #577DDD;
  font-size: 30px;
  &__label {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  &__img {
    width: auto;
    height: 47px;
    margin-left: 15px;
  }
  &__input {
    position: absolute;
    left: -99999rem;
  }
}
.form-publish-validate {
  cursor: pointer;
  border: none;
  padding: 0;
  background-color: #ecebeb;
  &__img {
    height: 47px;
  }
}
@media (min-width: 1904px) {
  .close-popup {
    width: 60px;
    top: 40px;
    left: 74%;
    &__img {
      width: 55px;
      height: 60px;
    }
  }
  .form-publish-display__textarea {
    font-size: 45px;
  }
  .form-publish-display__attachement {
    height: initial;
  }
  .form-publish-add-file {
    font-size: 45px;
    &__img {
      height: 70px;
    }
  }
  .form-publish-validate__img {
    height: 70px;
  }
}
@media (min-width: 960px) AND (max-width: 1264px) {
  .close-popup {
    width: 35px;
    top: 20px;
    left: 77.5%;
    &__img {
      width: 38px;
      height: 33px;
    }
  }
  .form-publish-wrap {
    width: 55%;
    border-radius: 20px;
  }
  .form-publish-display__textarea {
    font-size: 25px;
  }
  .form-publish-display__attachement {
    height: initial;
  }
  .form-publish-add-file {
    font-size: 25px;
    &__img {
      height: 43px;
    }
  }
  .form-publish-validate__img {
    height: 43px;
  }
}
@media (min-width: 600px) AND (max-width: 960px) {
  .close-popup {
    width: 32px;
    top: 20px;
    left: 77.5%;
    &__img {
      width: 35px;
      height: 30px;
    }
  }
  .form-publish-wrap {
    width: 55%;
    border-radius: 20px;
  }
  .form-publish-display__textarea {
    height: 80px;
    font-size: 20px;
  }
  .form-publish-display__attachement {
    height: initial;
  }
  .form-publish-add-file {
    font-size: 20px;
    &__img {
      height: 35px;
    }
  }
  .form-publish-validate__img {
    height: 35px;
  }
}
@media (max-width: 600px) {
  .close-popup {
    width: 28px;
    top: 18px;
    left: 90.5%;
    &__img {
      width: 30px;
      height: 25px;
    }
  }
  .form-publish-wrap {
    width: 85%;
    border-radius: 10px;
  }
  .form-publish-display__textarea {
    height: 70px;
    font-size: 17px;
  }
  .form-publish-display__attachement {
    height: initial;
  }
  .form-publish-add-file {
    font-size: 15px;
    &__img {
      height: 25px;
    }
  }
  .form-publish-validate__img {
    height: 25px;
  }
}
</style>