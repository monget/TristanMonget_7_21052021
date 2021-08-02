<template>
  <main class="main" role="main" aria-label="main">
    <Edit
      role="dialog"
      aria-label="popup modifier un commentaire"
      v-if="commentEdit.popup"
      :id="commentEdit.id"
      :message="commentEdit.message"
      :attachement="commentEdit.attachement"
      content="commentaire"
      @edit-comment="editComment($event)"
      @closing-popup-edit="closeEdit($event)"
    />
    <Delete
      role="dialog"
      aria-label="popup supprimer un commentaire"
      v-if="commentDelete.popup"
      message="commentaire"
      :id="commentDelete.id"
      @disactive-comment="disactiveComment($event)"
      @delete-comment="deleteComment()"
      @closing-popup-delete="closeDelete($event)"
    />
    <div class="home">
      <div class="publication">
        <article class="publication-display" role="article" :aria-label="'publication' + publication.id">
          <div class="publication-head">
            <div class="publication-profil" aria-label="avatar et nom de l'auteur">
              <router-link class="publication-profil__link" :to="'../profil/' + publication.userId">
                <img class="publication-profil__avatar" :src="publication.avatar" :alt="'avatar ' + publication.publishedBy">
                <span>{{ publication.publishedBy }}</span>
              </router-link>
              <span class="publication-date">.{{ formatDate(createdAt) }}</span>
            </div>
            <button class="publication-close" aria-label="fermer la publication" @click="close()">
              <img class="publication-close__img" alt="croix" title="fermer" src="../assets/icons/times-solid.svg">
            </button>
          </div>
          <div class="publication-content">
            <div aria-label="contenu de la publication">
              <p class="publication-content__message" v-if="publication.message">
                {{ publication.message }}
              </p>
              <img class="publication-content__attachement" :alt="'contenu de la publication ' + publication.publishedBy" v-if="publication.attachement" :src="publication.attachement">
            </div>
            <div class="publication-footer" aria-label="likes et commentaires">
              <div class="publication-like">
                <div aria-label="j'aime">
                  <button class="publication-like__btn" aria-label="bouton j'aime" @click="liked(publication.id, state)">
                    <img alt="pouce j'aime validé" v-if="state.liked" src="../assets/icons/thumbs-up-regular-green.svg">
                    <img alt="pouce j'aime" v-else src="../assets/icons/thumbs-up-regular.svg">
                  </button>
                  {{ publication.like }}
                </div>
                <div aria-label="je n'aime pas">
                  <button class="publication-like__btn" aria-label="bouton je n'aime pas" @click="disliked(publication.id, state)">
                    <img alt="pouce je n'aime pas validé" v-if="state.disliked" src="../assets/icons/thumbs-down-regular-red.svg">
                    <img alt="pouce je n'aime pas" v-else src="../assets/icons/thumbs-down-regular.svg">
                  </button>
                  {{ publication.dislike }}
                </div>
              </div>
              <div aria-label="commentaires">
                <img alt="logo commentaires" src="../assets/icons/comment-alt-regular.svg">
                {{ publication.totalComments }} commentaires
              </div>
            </div>
          </div>
        </article>
        <Comments
          v-if="publication.comments"
          :comments="publication.comments"
          @comment-delete="commentDeleteData($event)"
          @comment-edit="commentEditData($event)"
        />
        <div class="respond">
        <button aria-label="bouton pour répondre" class="respond__btn" @click="showPublishComment()">
          Répondre
        </button>
        </div>
        <div v-if="publishComment">
          <FocusLoop :is-visible="activeTrap">
            <button class="form-btn-close" aria-label="fermer" @click="showPublishComment()"></button>
            <ValidationObserver v-slot="{ handleSubmit }">
              <form class="form-comment-wrap" role="form" aria-label="formulaire pour ajouter un commentaire" @submit.prevent="handleSubmit(postComment)">
                <div class="form-comment-display">
                  <ValidationProvider ref="error" vid="comment" name="comment" v-slot="{ errors }">
                    <label class="form-comment-display__hidde-label" for="comment">commentaire</label>
                    <textarea class="form-comment-display__textarea" aria-label="votre commentaire" title="commentaire" type="text" id="comment" name="comment" @input="resize" placeholder="Votre commentaire..." v-model="message"/>
                    <span class="form-comment-display__error">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <img class="form-comment-display__attachement" alt="fichier ajouté" :src="displayFile()" v-if="image"/>
                  <div class="form-comment-footer">
                    <div class="form-comment-add-file" aria-label="Choisir un fichier à ajouter">
                      <label class="form-comment-add-file__label" for="file"> {{ image ? 'Modifier' : 'Ajouter' }}
                        <img class="form-comment-add-file__img" alt="fichier image bleu" src="../assets/icons/file-image-regular.svg">
                      </label>
                      <input class="form-comment-add-file__input" @change="fileSelected" type="file" name="file" id="file"/>
                    </div>
                    <div aria-label="Publier mon commentaire">
                      <button class="form-comment-validate" type="submit">
                        <img class="form-comment-validate__img" alt="avion en papier vert" src="../assets/icons/paper-plane-regular.svg">
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </ValidationObserver>
          </FocusLoop>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import PublicationDataService from "../services/PublicationDataService"
import CommentDataService from "../services/CommentDataService"
import Comments from '@/components/Comments.vue'
import Edit from '@/components/Edit.vue'
import Delete from '@/components/Delete.vue'
import { FocusLoop } from '@vue-a11y/focus-loop'
import { formatDistance, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'

export default {
  name: 'Publication',
  components: {
    Comments,
    Edit,
    Delete,
    FocusLoop
  },
  data() {
    return {
      publication: [],
      createdAt: null,
      state: {
        liked: '',
        disliked: ''
      },
      message: "",
      image: null,
      commentEdit: {},
      commentDelete: {},
      publishComment: false,
      activeTrap: false
    };
  },
  beforeMount() {
    this.setup(this.$route.params.id);
  },
  methods: {
    setup(id) {
      PublicationDataService.findOne(id)
        .then(response => {
          if (response.data.desactived == true) {
            this.$router.push('/404')
          }
          this.publication = response.data,
          this.createdAt = response.data.createdAt
          this.state = {
            liked: response.data.stateLike.liked,
            disliked: response.data.stateLike.disliked
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    formatDate(date) {
      return formatDistance(subDays(new Date(date), 0), new Date(), { locale: fr })
    },
    resize(event) {
      event.target.style.height = "initial";
      event.target.style.height = `${event.target.scrollHeight}px`;
    },
    liked(id, state) {
      if (state.liked == false && state.disliked == false) {
        const data = { like: 1 }
        PublicationDataService.like(id, data)
          .then(
            this.publication.like += 1,
            this.state = {
              disliked: false,
              liked: true
            },
          )
          .catch(e => {
            console.log(e.response.data);
          });
      }
      else if (state.liked == true && state.disliked == false) {
        const data = { like: 0 }
        PublicationDataService.like(id, data)
          .then(
            this.publication.like -= 1,
            this.state = {
              disliked: false,
              liked: false
            }
          )
          .catch(e => {
            console.log(e.response.data);
          });
      }
      else if (state.liked == false && state.disliked == true) {
        const data = { like: 1 }
        PublicationDataService.like(id, data)
          .then(
            this.publication.like += 1,
            this.publication.dislike += 1,
            this.state = {
              disliked: false,
              liked: true
            }
          )
          .catch(e => {
            console.log(e.response.data);
          });
      }
    },
    disliked(id, state) {
      if (state.liked == false && state.disliked == false) {
        const data = { like: -1 }
        PublicationDataService.like(id, data)
          .then(
            this.publication.dislike -= 1,
            this.state = {
              disliked: true,
              liked: false
            },
          )
          .catch(e => {
            console.log(e.response.data);
          });
      }
      else if (state.disliked == true && state.liked == false) {
        const data = { like: 0 }
        PublicationDataService.like(id, data)
          .then(
            this.publication.dislike += 1,
            this.state = {
              disliked: false,
              liked: false
            }
          )
          .catch(e => {
            console.log(e.response.data);
          });
      }
      else if (state.disliked == false && state.liked == true) {
        const data = { like: -1 }
        PublicationDataService.like(id, data)
          .then(
            this.publication.like -= 1,
            this.publication.dislike -= 1,
            this.state = {
              disliked: true,
              liked: false
            }
          )
          .catch(e => {
            console.log(e.response.data);
          });
      }
    },
    showPublishComment() {
      if (this.publishComment === false) {
        this.publishComment = true
        this.activeTrap = true
      }
      else {
        this.publishComment = false
        this.activeTrap = false
      }
    },
    postComment() {
      const data = new FormData();
      if (this.image != null) {
        data.append('image', this.image, this.image.name)
      }
      data.append('message', this.message)
      data.append('publicationId', this.$route.params.id)
      CommentDataService.create(data)
        .then(response => {
          this.message = ""
          this.image = null
          this.publication.comments.push(response.data)
          this.publication.totalComments += 1
          this.publishComment = false
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
    commentEditData(data) {
      this.commentEdit = data
    },
    editComment(data) {
      this.publication.comments[this.commentEdit.index].message = data.message
      if (data.attachement) {
        this.publication.comments[this.commentEdit.index].attachement = data.attachement
      }
    },
    disactiveComment(data){
      this.publication.comments[this.commentDelete.index].message = data.message
      this.publication.comments[this.commentDelete.index].attachement = data.attachement
      this.publication.comments[this.commentDelete.index].desactived = data.desactived
    },
    commentDeleteData(data) {
      this.commentDelete = data
    },
    deleteComment() {
      this.publication.comments.splice(this.commentDelete.index, 1)
      this.publication.totalComments -= 1
    },
    closeEdit(condition) {
      return this.commentEdit.popup = condition;
    },
    closeDelete(condition) {
      return this.commentDelete.popup = condition;
    },
    close() {
      this.$router.push('/publications');
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
.home {
  padding-left: 120px;
}
.publication {
  font-family: "Roboto-Regular";
  font-size: 30px;
  padding-top: 50px;
  padding-bottom: 50px;
  width: 55%;
}
.publication-display {
  padding: 10px;
  background: #2d3f5d;
  border-radius: 16px;
}
.publication-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.publication-profil {
  display: flex;
  align-items: center;
  &__link { 
    display: flex;
    align-items: center;
    color: white;
  }
  &__avatar {
    object-fit: cover;
    border-radius: 70px;
    border: 1px solid;
    width: 80px;
    height: 80px;
    margin-right: 20px;
    color: black;
  }
}
.publication-date {
  color: white;
  font-size: 19px;
  margin-top: 9px;
}
.publication-close {
  padding: 0;
  cursor: pointer;
  background: #2d3f5d;
  border: none;
  &__img {
    width: 30px;
    position: relative;
    top: -25px;
  }
}
.publication-content {
  padding: 1%;
  background-color: white;
  border-radius: 0px 0px 10px 10px;
  &__message {
    margin: 10px 0px 20px;
  }
  &__attachement {
    width: 100%;
  }
}
.publication-footer {
  font-size: 28px;
  display: flex;
  margin: 5px 0px;
  color: #909090;
  justify-content: space-between;
  & div {
    display: flex;
    align-items: center;
  }
  & img {
    width: 35px;
    margin-right: 15px;
  }
}
.publication-like {
  width: 30%;
  justify-content: space-between;
  &__btn {
    cursor: pointer;
    border: none;
    background-color: white;
  }
}
a {
  cursor: pointer;
  text-decoration: none;
  color: black;
}
.respond {
  display: flex;
  justify-content: flex-end;
  &__btn {
    border-radius: 30px;
    padding: 1%;
    margin-top: 10px;
    background-color: white;
    font-size: 20px;
  }
}
.form-btn-close {
  position: absolute;
  left: -99999rem;
}
.form-comment-wrap {
  font-size: 20px;
  padding: 5%;
  margin-top: 10px;
  background-color: white;
  border: 2px solid #909090;
  border-radius: 70px;
}
.form-comment-display {
  &__hidde-label {
  display: none;
  }
  &__textarea {
    font-family: "Roboto-Regular";
    font-size: 25px;
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
    box-sizing: border-box;
  }
  &__error {
    display: block;
    text-align: center;
    font-size: 26px;
    color: red;
  }
  &__attachement {
    width: 25%;
  }
}
.form-comment-footer {
  margin: 25px 0px 0px;
  display: flex;
  justify-content: space-between;
}
.form-comment-add-file {
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
.form-comment-validate {
  cursor: pointer;
  border: none;
  padding: 0;
  background-color: white;
  &__img {
    height: 47px;
  }
}
@media (min-width: 1904px) {
  .home {
    padding-left: 250px;
  }
  .publication {
    padding-top: 170px;
    font-size: 40px;
    width: 50%;
  }
  .publication-profil {
    &__avatar {
      border-radius: 100px;
      width: 100px;
      height: 100px;
    }
  }
  .publication-date {
    font-size: 26px;
  }
  .publication-close__img {
    width: 35px;
    top: -35px;
  }
  .publication-footer {
    font-size: 30px;
    & img {
      width: 40px;
    }
  }
  .publication-like {
    width: 25%;
  }
  .respond__btn {
    font-size: 25px;
  }
  .form-comment-display__textarea {
    font-size: 40px;
  }
  .form-comment-add-file {
    font-size: 40px;
  }
}
@media (min-width: 1264px) AND (max-width: 1904px) {
  .home {
    padding-left: 100px;
  }
  .publication-close__img {
    width: 27px;
    top: -27px;
  }
  .form-comment-display__textarea {
    font-size: 30px;
  }
  .form-comment-add-file {
    font-size: 30px;
  }
}
@media (min-width: 960px) AND (max-width: 1264px) {
  .home {
    padding-left: 50px;
  }
  .publication {
    font-size: 25px;
  }
  .publication-profil__avatar {
    border-radius: 70px;
    width: 70px;
    height: 70px;
  }
  .publication-date {
    font-size: 14px;
  }
  .publication-close__img {
    width: 25px;
    top: -24px;
  }
  .publication-footer {
    font-size: 20px;
    & img {
      width: 25px;
    }
  }
  .respond__btn {
    font-size: 15px;
  }
  .form-comment-wrap {
    border-radius: 40px;
  }
  .form-comment-display__textarea {
    font-size: 25px;
  }
  .form-comment-add-file {
    font-size: 25px;
    &__img {
      height: 40px;
    }
  }
  .form-comment-validate__img {
    height: 40px;
  }
}
@media (min-width: 600px) AND (max-width: 960px) {
  .home {
    padding-left: 50px;
  }
  .publication {
    font-size: 18px;
  }
  .publication-profil__avatar {
    margin-right: 15px;
    border-radius: 60px;
    width: 60px;
    height: 60px;
  }
  .publication-date {
    font-size: 11px;
    margin-top: 5px;
  }
  .publication-close__img {
    width: 18px;
    top: -22px;
  }
  .publication-footer {
    font-size: 15px;
    & img {
      width: 20px;
      margin-right: 5px;
    }
  }
  .respond__btn {
    font-size: 10px;
  }
  .form-comment-wrap {
    border-radius: 40px;
  }
  .form-comment-display__textarea {
    font-size: 18px;
  }
  .form-comment-add-file {
    font-size: 18px;
    &__img {
      height: 30px;
    }
  }
  .form-comment-validate__img {
    height: 30px;
  }
}
@media (max-width: 600px) {
  .home {
    padding-left: 0px;
  }
  .publication {
    width: 100%;
    padding-top: 25px;
    padding-bottom: 0px;
    font-size: 17px
  }
  .publication-profil__avatar {
    margin-right: 10px;
    border-radius: 45px;
    width: 45px;
    height: 45px;
  }
  .publication-date {
    font-size: 11px;
    margin-top: 5px;
    white-space: nowrap;
  }
  .publication-close__img {
    width: 18px;
    top: -18px;
  }
  .publication-footer {
    font-size: 15px;
    & img {
      width: 20px;
      margin-right: 5px;
    }
  }
  .publication-like {
    width: 35%;
  }
  .respond__btn {
    font-size: 10px;
  }
  .form-comment-wrap {
    border-radius: 35px;
  }
  .form-comment-display__textarea {
    font-size: 17px;
  }
  .form-comment-add-file {
    font-size: 17px;
    &__img {
      height: 25px;
    }
  }
  .form-comment-validate__img {
    height: 25px;
  }
}
</style>