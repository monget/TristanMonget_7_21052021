<template>
  <main>
    <Edit
      v-if="commentEdit.popup"
      :id="commentEdit.id"
      :message="commentEdit.message"
      :attachement="commentEdit.attachement"
      content="commentaire"
      @edit-comment="editComment($event)"
      @closing-popup-edit="closeEdit($event)"
    />
    <Delete
      v-if="commentDelete.popup"
      message="commentaire"
      :id="commentDelete.id"
      @disactive-comment="disactiveComment($event)"
      @delete-comment="deleteComment()"
      @closing-popup-delete="closeDelete($event)"
    />
    <div class="home">
      <div class="publication">
        <div class="publication__wrap">
          <div class="publication__head">
            <div class="profil">
              <router-link class="profil__link" :to="'../profil/' + publication.userId">
                <img class="profil__avatar" :src="publication.avatar" :title="publication.publishedBy">
                <span>{{ publication.publishedBy }}</span>
              </router-link>
              <span class="profil__date">.{{ formatDate(createdAt) }}</span>
            </div>
            <button class="publication__close" @click="close()">
              <img src="../assets/icons/times-solid.svg">
            </button>
          </div>
          <div class="content">
            <p class="content__message" v-if="publication.message">
              {{ publication.message }}
            </p>
            <img class="content__attachement" v-if="publication.attachement" :src="publication.attachement">
            <div class="content__footer">
              <div class="like">
                <div>
                  <button @click="liked(publication.id, state)">
                    <img v-if="state.liked" src="../assets/icons/thumbs-up-regular-green.svg">
                    <img v-else src="../assets/icons/thumbs-up-regular.svg">
                  </button>
                  {{ publication.like }}
                </div>
                <div>
                  <button @click="disliked(publication.id, state)">
                    <img v-if="state.disliked" src="../assets/icons/thumbs-down-regular-red.svg">
                    <img v-else src="../assets/icons/thumbs-down-regular.svg">
                  </button>
                  {{ publication.dislike }}
                </div>
              </div>
              <div>
                <img src="../assets/icons/comment-alt-regular.svg">
                {{ publication.totalComments }} commentaires
              </div>
            </div>
          </div>
        </div>
        <div>
          <ValidationObserver v-slot="{ handleSubmit }">
            <form class="form" @submit.prevent="handleSubmit(postComment)">
              <div class="form__wrap">
                <ValidationProvider ref="error" vid="comment" name="comment" v-slot="{ errors }">
                  <textarea class="content__textarea" type="text" id="comment" name="comment" @input="resize" placeholder="Votre commentaire..." v-model="message"/>
                  <span class="content__error">{{ errors[0] }}</span>
                </ValidationProvider>
                <img class="content__attachement" :src="displayFile()" v-if="image"/>
                <div class="footer__wrap">
                  <div class="add_file">
                    <label for="file">Ajouter<img src="../assets/icons/file-image-regular.svg"></label>
                    <input @change="fileSelected" type="file" name="file" id="file" class="inputfile" />
                  </div>
                  <div><button class="validate"><img src="../assets/icons/paper-plane-regular.svg"></button></div>
                </div>
              </div>
            </form>
          </ValidationObserver>
        </div>
        <Comments
          v-if="publication.comments"
          :comments="publication.comments"
          @comment-delete="commentDeleteData($event)"
          @comment-edit="commentEditData($event)"
        />
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
import { formatDistance, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'

export default {
  name: 'Publication',
  components: {
    Comments,
    Edit,
    Delete
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
      commentDelete: {}
    };
  },
  beforeMount() {
    this.setup(this.$route.params.id);
  },
  mounted() {
    this.$nextTick(() => {
      this.$el.setAttribute("style", "height", `${this.$el.scrollHeight}px`);
    });
  },
  methods: {
    setup(id) {
      PublicationDataService.findOne(id)
        .then(response => {
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
      event.target.style.height = "45px";
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
    },
    commentDeleteData(data) {
      this.commentDelete = data
    },
    deleteComment() {
      this.publication.comments.splice(this.commentDelete.index, 1)
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
  &__wrap {
    padding: 10px;
    background: #909090;
    border-radius: 16px;
  }
  &__head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    & a {
      display: flex;
      align-items: center;
    }
  }
  &__close {
    cursor: pointer;
    background: #909090;
    border: none;
    & img {
      width: 30px;
    }
  }
}

.profil {
  display: flex;
  align-items: center;
  &__link { 
    display: flex;
    align-items: center;
    color: white;
  }
  &__avatar {
    object-fit: cover;
    border-radius: 30px;
    border: 1px solid;
    width: 50px;
    height: 50px;
    margin-right: 20px;
    color: black;
  }
  &__date {
    color: white;
    font-size: 19px;
    margin-top: 9px;
  }
}


.content {
  padding: 1%;
  background-color: white;
  border-radius: 0px 0px 10px 10px;
  &__message {
    margin: 10px 0px 20px;
  }
  &__attachement {
    width: 100%;
  }
  &__footer {
    color: #909090;
    font-size: 28px;
    display: flex;
    margin: 5px 0px;
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
}
.like {
  display: flex;
  width: 30%;
  justify-content: space-between;
  & button {
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

.form {
  font-size: 20px;
  padding: 2%;
  background-color: white;
  border: 2px solid #909090;
  &__wrap {
    font-family: "Roboto-Regular";
    padding: 4%;
  }
}
.content {
  &__textarea {
    font-family: "Roboto-Regular";
    font-size: 25px;
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
    box-sizing: border-box;
    height: 45px;
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
    display: none;
  }
}
.validate {
  cursor: pointer;
  border: none;
  padding: 0;
  background-color: white;
  & img {
    height: 47px;
  }
}
</style>