<template>
  <div role="group" aria-label="tous les commentaires" class="comment">
    <div role="article" :aria-label="'commentaire' + comment.id" class="comment__wrap" v-for="(comment, index) in comments" :key="index">
      <div class="message">
      <div aria-label="avatar et options" class="comment__head">
        <div aria-label="avatar de l'auteur" class="profil">
          <router-link class="profil__link" :to="'../profil/' + comment.userId">
            <img class="profil__avatar" :src="comment.avatar" :alt="'avatar ' + comment.commentedBy"> 
          </router-link>
        </div>
        <div aria-label="options du commentaire" class="comment__options" v-if="creatorComment(comment.userId)">
          <button aria-label="modifier le commentaire" v-if="rules(comment.userId)" @click="showEdit(comment.id, comment.message, comment.attachement, index)">
            <img alt="modifier" src="../assets/icons/edit-solid.svg">
          </button>
          <button aria-label="supprimer le commentaire" @click="showDelete(comment.id, index)">
            <img alt="poubelle" src="../assets/icons/trash-alt-solid.svg">
          </button>
        </div>
      </div>
      <div aria-label="contenu" class="content">
        <div aria-label="nom de l'auteur">
          <span>{{ comment.commentedBy }}</span>
          <span class="profil__date">.{{ formatDate(comment.createdAt) }}</span>
        </div>
        <div aria-label="message et / ou  image">
          <p class="content__message" v-if="comment.message" >
            {{ comment.message }}
          </p>
          <img :alt="'contenu du commentaire ' + comment.commentedBy" class="content__attachement" v-if="comment.attachement" :src="comment.attachement">
        </div>
        <div aria-label="likes" class="content__footer">
          <div class="like">
            <div aria-label="j'aime">
              <button aria-label="bouton j'aime" @click="liked(comment.id, index, comment.stateLike)">
                <img alt="pouce j'aime validé" v-if="comment.stateLike.liked" src="../assets/icons/thumbs-up-regular-green.svg">
                <img alt="pouce j'aime" v-else src="../assets/icons/thumbs-up-regular.svg">
              </button>
              {{ comment.like }}
            </div>
            <div aria-label="je n'aime pas">
              <button aria-label="bouton je n'aime pas" @click="disliked(comment.id, index, comment.stateLike)">
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
.comment {
  &__wrap {
    margin-top: -30px;
  }
  font-family: "Roboto-Regular";
  font-size: 30px;
  &__head {
    top: 65px;
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  &__options {
    width: 15%;
    display: flex;
    justify-content: space-between;
    & button {
      cursor: pointer;
      background: none;
      border: none;
      & img {
        top: -30px;
        height: 25px;
        position: relative;
      }
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
    border-radius: 70px;
    border: 1px solid;
    width: 80px;
    height: 80px;
    margin-right: 20px;
    color: black;
  }
  &__date {
    font-size: 19px;
    margin-top: 9px;
  }
}
.content {
  padding: 3%;
  background-color: white;
  border-radius: 40px;
  width: 80%;
  position: relative;
  left: 100px;
  &__message {
    margin: 10px 0px 20px;
  }
  &__attachement {
    width: 30%;
  }
  &__footer {
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
.onTop {
  position: fixed;
  right: 10%;
  top: 48%;
  width: 346px;
  border: 2px solid #909090;
  background-color: white;
  &__content {
    font-family: "Roboto-Regular";
    font-size: 28px;
    margin: 10px 0px;
    color: #ff7c03;
    text-align: center;
    display: flex;
    flex-direction: column;
  }
}
.best {
  margin: 10px;
  &__detail {
    padding: 0;
    width: 100%;
    border: none;
    cursor: pointer;
    height: 60px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    background-color: #ff7c03;
  }
  &__avatar {
    padding: 2%;
    margin-right: 5px;
    object-fit: cover;
    border-radius: 30px;
    width: 50px;
    height: 50px;
  }
  &__message {
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: white;
  }
  &__logo {
    width: 25px;
  }
}
</style>