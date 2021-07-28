<template>
  <div role="group" aria-label="tous les commentaires">
    <div class="comment-wrap" role="article" :aria-label="'commentaire' + comment.id" v-for="(comment, index) in comments" :key="index">
      <div class="comment-head" aria-label="avatar et options">
        <div class="comment-profil" aria-label="avatar de l'auteur">
          <router-link class="comment-profil__link" :to="'../profil/' + comment.userId">
            <img class="comment-profil__avatar" :src="comment.avatar" :alt="'avatar ' + comment.commentedBy"> 
          </router-link>
        </div>
        <div class="comment-options" aria-label="options du commentaire" v-if="creatorComment(comment.userId)">
          <button class="comment-options__btn" aria-label="modifier le commentaire" v-if="rules(comment.userId)" @click="showEdit(comment.id, comment.message, comment.attachement, index)">
            <img class="comment-options__img" alt="modifier" src="../assets/icons/edit-solid.svg">
          </button>
          <button class="comment-options__btn" aria-label="supprimer le commentaire" @click="showDelete(comment.id, index)">
            <img class="comment-options__img" alt="poubelle" src="../assets/icons/trash-alt-solid.svg">
          </button>
        </div>
      </div>
      <div class="comment-content-wrap" aria-label="contenu">
        <div class="comment-content">
          <div aria-label="nom de l'auteur">
            <span>{{ comment.commentedBy }}</span>
            <span class="comment-content__date">.{{ formatDate(comment.createdAt) }}</span>
          </div>
          <div aria-label="message et / ou  image">
            <p class="comment-content__message" v-if="comment.message" >
              {{ comment.message }}
            </p>
            <img class="comment-content__attachement" :alt="'contenu du commentaire ' + comment.commentedBy" v-if="comment.attachement" :src="comment.attachement">
          </div>
          <div class="comment-footer" aria-label="likes">
            <div class="comment-like">
              <div aria-label="j'aime">
                <button class="comment-like__btn" aria-label="bouton j'aime" @click="liked(comment.id, index, comment.stateLike)">
                  <img alt="pouce j'aime validé" v-if="comment.stateLike.liked" src="../assets/icons/thumbs-up-regular-green.svg">
                  <img alt="pouce j'aime" v-else src="../assets/icons/thumbs-up-regular.svg">
                </button>
                {{ comment.like }}
              </div>
              <div aria-label="je n'aime pas">
                <button class="comment-like__btn" aria-label="bouton je n'aime pas" @click="disliked(comment.id, index, comment.stateLike)">
                  <img alt="pouce je n'aime pas validé" v-if="comment.stateLike.disliked" src="../assets/icons/thumbs-down-regular-red.svg">
                  <img alt="pouce je n'aime pas" v-else src="../assets/icons/thumbs-down-regular.svg">
                </button>
                {{ comment.dislike }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommentDataService from "../services/CommentDataService"
import { formatDistance, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'

export default {
  name: 'Comments',
  props: {
    comments: Array
  },
  methods: {
    formatDate(date) {
      return formatDistance(subDays(new Date(date), 0), new Date(), { locale: fr })
    },
    creatorComment(userId) {
      let user = JSON.parse(localStorage.getItem('user'));
      if (user.Id === userId || user.isAdmin === true) {
        return true
      }
      return false
    },
    rules(userId) {
      let user = JSON.parse(localStorage.getItem('user'))
      if (user.isAdmin === true && user.Id != userId) {
        return false
      }
      else if (user.isAdmin === true && user.Id === userId) {
        return true
      }
      return true
    },
    liked(id, index, state) {
      if (state.liked == false && state.disliked == false) {
        const data = { like: 1 }
        CommentDataService.like(id, data)
          .then(
            this.comments[index].like += 1,
            this.comments[index].stateLike = {
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
        CommentDataService.like(id, data)
          .then(
            this.comments[index].like -= 1,
            this.comments[index].stateLike = {
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
        CommentDataService.like(id, data)
          .then(
            this.comments[index].like += 1,
            this.comments[index].dislike += 1,
            this.comments[index].stateLike = {
              disliked: false,
              liked: true
            }
          )
          .catch(e => {
            console.log(e.response.data);
          });
      }
    },
    disliked(id, index, state) {
      if (state.liked == false && state.disliked == false) {
        const data = { like: -1 }
        CommentDataService.like(id, data)
          .then(
            this.comments[index].dislike -= 1,
            this.comments[index].stateLike = {
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
        CommentDataService.like(id, data)
          .then(
            this.comments[index].dislike += 1,
            this.comments[index].stateLike = {
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
        CommentDataService.like(id, data)
          .then(
            this.comments[index].like -= 1,
            this.comments[index].dislike -= 1,
            this.comments[index].stateLike = {
              disliked: true,
              liked: false
            }
          )
          .catch(e => {
            console.log(e.response.data);
          });
      }
    },
    showEdit(id, message, attachement, index) {
      this.$emit('comment-edit', { id, message, attachement, index, popup: true })
    },
    showDelete(id, index) {
      this.$emit('comment-delete', { id, index, popup: true })
    },
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "Roboto-Regular";
  src: local("Roboto-Regular"),
  url(../fonts/Roboto-Regular.ttf) format("truetype");
}
.comment-wrap {
  margin-top: -30px;
}
.comment-head {
  top: 65px;
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.comment-profil {
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
.comment-options {
  width: 15%;
  display: flex;
  justify-content: space-between;
  &__btn {
    cursor: pointer;
    background: none;
    border: none;
  }
  &__img {
    top: -30px;
    height: 25px;
    position: relative;
  }
}
.comment-content-wrap {
  display: flex;
  justify-content: flex-end;
}
.comment-content {
  width: 80%;
  padding: 2% 4%;
  border-radius: 40px;
  background-color: white;
  &__date {
    font-size: 19px;
    margin-top: 9px;
  }
  &__message {
    margin: 10px 0px 20px;
    word-wrap: break-word;
  }
  &__attachement {
    width: 25%;
    margin-bottom: 10px;
  }
}
.comment-footer {
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
.comment-like {
  display: flex;
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
@media (min-width: 1904px) {
 .comment-profil__avatar {
    border-radius: 100px;
    width: 100px;
    height: 100px;
  }
  .comment-options__img {
    height: 35px;
  }
  .comment-content__date {
    font-size: 26px;
  }
  .comment-footer {
    font-size: 30px;
    & img {
      width: 40px;
    }
  }
}
@media (min-width: 1264px) AND (max-width: 1904px) {
 .comment-like {
    width: 35%;
  }
}
@media (min-width: 960px) AND (max-width: 1264px) {
  .comment-profil__avatar {
    border-radius: 60px;
    width: 60px;
    height: 60px;
  }
  .comment-options {
    width: 20%;
    &__img {
      top: -35px;
      height: 20px;
    }
  }
  .comment-content {
    width: 75%;
    &__date {
      font-size: 14px;
    }
  }
  .comment-footer {
    font-size: 20px;
    & img {
      width: 25px;
    }
  }
  .comment-like {
    width: 40%;
  }
}
@media (min-width: 600px) AND (max-width: 960px) {
   .comment-profil__avatar {
    border-radius: 60px;
    width: 60px;
    height: 60px;
  }
  .comment-options {
    width: 22%;
    &__img {
      top: -30px;
      height: 16px;
    }
  }
  .comment-content {
    border-radius: 30px;
    width: 70%;
    padding: 2% 5%;
    &__date {
      font-size: 11px;
    }
  }
  .comment-footer {
    font-size: 15px;
    & img {
      margin-right: 5px;
      width: 20px;
    }
  }
  .comment-like {
    width: 43%;
  }
}
@media (max-width: 600px) {
  .comment-wrap {
    margin: -30px 5px 0px;
  }
  .comment-head {
    top: 45px;
  }
  .comment-profil__avatar {
    border-radius: 45px;
    width: 45px;
    height: 45px;
  }
  .comment-options {
    width: 22%;
    &__img {
      top: -20px;
      height: 17px;
    }
  }
  .comment-content {
    border-radius: 30px;
    width: 75%;
    padding: 2% 5%;
    &__date {
      font-size: 11px;
    }
    &__attachement {
      width: 35%;
      margin: 5px;
    }
  }
  .comment-footer {
    font-size: 15px;
    & img {
      margin-right: 5px;
      width: 20px;
    }
  }
  .comment-like {
    width: 43%;
  }
}
</style>