<template>
  <div class="background">
    <FocusLoop :is-visible="activeTrap">
      <div aria-label="popup de modification">
        <button class="close-popup" aria-label="fermer le popup" @click="close()">
            <img class="close-popup__img" alt="croix" src="../assets/icons/times-solid.svg">
        </button>
        <ValidationObserver v-slot="{ handleSubmit }">
          <form class="form-edit-wrap" role="form" aria-label="formulaire de modification" @submit.prevent="handleSubmit(editForm)">
            <div class="form-edit-display">
              <ValidationProvider ref="error" vid="comment" name="comment" v-slot="{ errors }">
                <label class="form-edit-display__hidde-label" for="comment">commentaire</label>
                <textarea class="form-edit-display__textarea" aria-label="votre message" type="text" id="comment" name="comment" aria-describedby="error" v-model="newMessage"/>
                <span class="form-edit-display__error" aria-label="affichage des erreurs si le commentaire est vide" id="error">{{ errors[0] }}</span>
              </ValidationProvider>
              <img class="form-edit-display__attachement" alt="fichier ajouté" :src="displayFile()" v-if="attachement || image"/>
              <div class="form-edit-footer">
                <div  class="form-edit-add-file" aria-label="Choisir un fichier">
                  <label class="form-edit-add-file__label" for="file"> {{ attachement || image ? 'Modifier' : 'Ajouter' }}
                    <img class="form-edit-add-file__img" alt="fichier image bleu" src="../assets/icons/file-image-regular.svg">
                  </label>
                  <input class="form-edit-add-file__input" @change="fileSelected" type="file" name="file" id="file"/>
                </div>
                <div aria-label="Valider la modification">
                  <button class="form-edit-validate" type="submit">
                    <img class="form-edit-validate__img" alt="avion en papier vert" title="valider" src="../assets/icons/paper-plane-regular.svg">
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
import CommentDataService from "../services/CommentDataService"
import { FocusLoop } from '@vue-a11y/focus-loop'

export default {
  name: 'Publish',
  components: {
    FocusLoop
  },
  props: {
    id: Number,
    message: String,
    attachement: String,
    content: String
  },
  data() {
    return {
      newMessage: this.message,
      image: null,
      activeTrap: true
    };
  },
  methods: {
    editForm() {
      const data = new FormData();
      if (this.image != null) {
        data.append('image', this.image, this.image.name)
      }
      data.append('message', this.newMessage)
      if (this.content === "publication") {
        PublicationDataService.update(this.id, data)
          .then(response => {
            if (response) {
              this.$emit('edit-publication', response.data)
              this.$emit('closing-popup-edit', false)
            }
          })
          .catch(e => {
            this.$refs.error.setErrors([e.response.data.message])
          });
      }
      else if (this.content === "commentaire") {
        data.append('publicationId', this.$route.params.id)
        CommentDataService.update(this.id, data)
          .then(response => {
            if (response) {
              this.$emit('edit-comment', response.data)
              this.$emit('closing-popup-edit', false)
            }
          })
          .catch(e => {
            this.$refs.error.setErrors([e.response.data.message])
          });
      }

    },
    fileSelected(event) {
      this.image = event.target.files[0]
    },
    close() {
      this.$emit('closing-popup-edit', false);
    },
    displayFile() {
      if (this.image != null) {
        return this.url = URL.createObjectURL(this.image);
      }
      return this.attachement
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
.form-edit-wrap {
  font-size: 20px;
  padding: 2%;
  width: 47%;
  margin: auto;
  border: 1px solid #00000050;
  background-color: white;
  border-radius: 30px;
}
.form-edit-display {
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
.form-edit-footer {
  margin: 25px 0px 0px;
  display: flex;
  justify-content: space-between;
}
.form-edit-add-file {
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
.form-edit-validate {
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
  .form-edit-display__textarea {
    font-size: 45px;
  }
  .form-edit-display__attachement {
    height: initial;
  }
  .form-edit-add-file {
    font-size: 45px;
    &__img {
      height: 70px;
    }
  }
  .form-edit-validate__img {
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
  .form-edit-wrap {
    width: 55%;
    border-radius: 20px;
  }
  .form-edit-display__textarea {
    font-size: 25px;
  }
  .form-edit-display__attachement {
    height: initial;
  }
  .form-edit-add-file {
    font-size: 25px;
    &__img {
      height: 43px;
    }
  }
  .form-edit-validate__img {
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
  .form-edit-wrap {
    width: 55%;
    border-radius: 20px;
  }
  .form-edit-display__textarea {
    height: 80px;
    font-size: 20px;
  }
  .form-edit-display__attachement {
    height: initial;
  }
  .form-edit-add-file {
    font-size: 20px;
    &__img {
      height: 35px;
    }
  }
  .form-edit-validate__img {
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
  .form-edit-wrap {
    width: 85%;
    border-radius: 10px;
  }
  .form-edit-display__textarea {
    height: 70px;
    font-size: 17px;
  }
  .form-edit-display__attachement {
    height: initial;
  }
  .form-edit-add-file {
    font-size: 15px;
    &__img {
      height: 25px;
    }
  }
  .form-edit-validate__img {
    height: 25px;
  }
}
</style>