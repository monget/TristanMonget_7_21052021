<template>
  <div class="background">
    <FocusLoop :is-visible="activeTrap">
      <div aria-label="popup de modification">
        <button aria-label="fermer le popup" class="close" @click="close()">
            <img alt="croix" src="../assets/icons/times-solid.svg">
        </button>
        <ValidationObserver v-slot="{ handleSubmit }">
          <form role="form" aria-label="formulaire de modification" @submit.prevent="handleSubmit(editForm)" class="form">
            <div class="form__wrap">
              <ValidationProvider ref="error" vid="comment" name="comment" v-slot="{ errors }">
                <label class="hiddelabel" for="comment">commentaire</label>
                <textarea aria-label="votre message" class="content__textarea" type="text" id="comment" name="comment" aria-describedby="error" v-model="newMessage"/>
                <span aria-label="affichage des erreurs si le commentaire est vide" id="error" class="content__error">{{ errors[0] }}</span>
              </ValidationProvider>
              <img class="content__attachement" alt="fichier ajouté" :src="displayFile()" v-if="attachement || image"/>
              <div class="footer__wrap">
                <div aria-label="Choisir un fichier" class="add_file">
                  <label for="file"> {{ attachement || image ? 'Modifier' : 'Ajouter' }}
                    <img alt="fichier image bleu" src="../assets/icons/file-image-regular.svg">
                  </label>
                  <input @change="fileSelected" type="file" name="file" id="file" class="inputfile" />
                </div>
                <div aria-label="Valider la modification">
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