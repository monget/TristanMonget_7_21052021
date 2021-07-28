<template>
  <main class="main" role="main" aria-label="main">
    <Edit
      role="dialog"
      aria-label="popup modifier la publication"
      v-if="edit"
      :id="publicationEdit.id"
      :message="publicationEdit.message"
      :attachement="publicationEdit.attachement"
      content="publication"
      @edit-publication="editPublication($event)"
      @closing-popup-edit="closeEdit($event)"
    />
    <Delete
      role="dialog"
      aria-label="popup supprimer la publication"
      v-if="deleted"
      message="publication"
      :id="publicationDelete.id"
      @disactive-publication="disactivePublication($event)"
      @delete-publication="deletePublication()"
      @closing-popup-delete="closeDelete($event)"
    />
    <div class="home" >
      <aside class="Top" role="complementary" aria-label="publication et contributeur au top">
        <div class="Top-display">
          <div class="best" aria-label="publication au top">
            <span>Meilleure publication</span>
            <router-link class="best__link" :to="'publication/' + topPublication.id">
              <img class="best__avatar" alt="avatar de la meilleure publication" :src="topPublication.avatar">
              <div class="best__message"> 
                {{ topPublication.message }}
              </div>
            </router-link>
          </div>
          <div class="horizontal-line"></div>
          <div class="best" aria-label="contributeur au top">
            <span>Contributeur au
              <img alt="main avec l'index pointé vers le haut" class="best-contributor-logo" src="../assets/icons/hand-point-up-solid.svg">
            </span>
            <router-link class="best__link" :to="'profil/' + topContributor.id">
              <img class="best__avatar" alt="avatar du meilleur contributeur" :src="topContributor.avatar">
              <div class="best__message"> 
                {{ topContributor.name }}
              </div>
            </router-link>
          </div>
        </div>
      </aside>
      <button class="publish-button" aria-label="Publiez du contenu" @click="showPublish()">
        <img class="publish-button__img" alt="Votre avatar" :src="userAvatar">
        <h1 class="publish-button__title">Publiez quelque chose...</h1>
      </button>
      <Publish
        role="dialog"
        aria-label="popup ajouter une publication"
        v-if="publish"
        @add-publication="addPublication($event)"
        @closing-popup-publish="closePublish($event)"
      />
      <section class="publications" role="group" aria-label="toutes les publications">
        <article class="publication-display" role="article" :aria-label="'publication' + publication.id" v-for="(publication, index) in publications" :key="index">
          <div class="publication-head">
            <div class="publication-profil" aria-label="avatar et nom de l'auteur">
              <router-link class="publication-profil__link" :to="'profil/' + publication.userId">
                <img class="publication-profil__avatar" :src="publication.avatar" :alt="'avatar ' + publication.publishedBy">
                <span>{{ publication.publishedBy }}</span>
              </router-link>
              <span class="publication-date">.{{ formatDate(publication.createdAt) }}</span>
            </div>
            <div class="publication-options" aria-label="options de la publication" v-if="CreatorPublication(publication.userId)">
              <button class="publication-options__button" aria-label="modifier la publication" v-if="rules(publication.userId)" @click="showEdit(publication.id, publication.message, publication.attachement, index)">
                <img class="publication-options__img" alt="modifier" src="../assets/icons/edit-solid.svg">
              </button>
              <button class="publication-options__button" aria-label="supprimer la publication" @click="showDelete(publication.id, index)">
                <img class="publication-options__img" alt="poubelle" src="../assets/icons/trash-alt-solid.svg">
              </button>
            </div>
          </div>
          <div class="publication-content">
            <router-link aria-label="contenu de la publication" :to="'publication/' + publication.id">
              <p class="publication-content__message" v-if="publication.message" >
                {{ publication.message }}
              </p>
              <img class="publication-content__attachement publication-content__attachement--reduce" :alt="'contenu de la publication ' + publication.publishedBy" v-if="publication.attachement" :src="publication.attachement">
            </router-link>
            <div class="publication-footer" aria-label="likes et commentaires">
              <div class="publication-like">
                <div aria-label="j'aime">
                  <button class="publication-like__btn" aria-label="bouton j'aime" @click="liked(publication.id, index, publication.stateLike)">
                    <img alt="pouce j'aime validé" v-if="publication.stateLike.liked" src="../assets/icons/thumbs-up-regular-green.svg">
                    <img alt="pouce j'aime" v-else src="../assets/icons/thumbs-up-regular.svg">
                  </button>
                  {{ publication.like }}
                </div>
                <div aria-label="je n'aime pas">
                  <button class="publication-like__btn" aria-label="bouton je n'aime pas" @click="disliked(publication.id, index, publication.stateLike)">
                    <img alt="pouce je n'aime pas validé" v-if="publication.stateLike.disliked" src="../assets/icons/thumbs-down-regular-red.svg">
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
      </section>
    </div>
  </main>
</template>

<script>
import PublicationDataService from "../services/PublicationDataService"
import Publish from '@/components/Publish.vue'
import Edit from '@/components/Edit.vue'
import Delete from '@/components/Delete.vue'
import { formatDistance, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'

export default {
  name: 'Publications',
  components: {
    Publish,
    Edit,
    Delete
  },
  data() {
    return {
      publications: [],
      publicationEdit: '',
      publicationDelete: '',
      topPublication: '',
      topContributor: '',
      userAvatar: null,
      deleted: false,
      publish: false,
      edit: false
    };
  },
  computed: {
    newAvatar() {
      return this.$store.state.avatar;
    }
  },
  beforeMount() {
    this.setup();
    this.avatar();
  },
  methods: {
    setup() {
      PublicationDataService.findAll()
        .then(response => {
          this.publications = response.data
          let bestPublication = []
          let countlikes = []
          let contributorsId = []
          let contributors = []
          this.publications.forEach(publication => {
            bestPublication.push(publication.id)
            contributorsId.push(publication.userId)
            countlikes.push(publication.like)
            const data = {
              id: publication.userId,
              name: publication.publishedBy,
              avatar: publication.avatar
            }
            contributors.push(data)
          });
          const indexOfMaxValue = countlikes.indexOf(Math.max(...countlikes));
          this.topPublication = this.publications[indexOfMaxValue]

          let occurrences = contributorsId.reduce(function(obj, item) {
            obj[item] = (obj[item] || 0) + 1;
            return obj;
          }, {});
          let nbOfContribution = 0
          let contributorId = ''
          for (const property in occurrences) {
            if (`${occurrences[property]}` > nbOfContribution) {
              nbOfContribution = `${occurrences[property]}`
              contributorId = `${property}`
            }
          }
          const resultat = contributors.find(contributor => contributor.id == contributorId);
          this.topContributor = resultat
        })
        .catch(e => {
          console.log(e)
        });
    },
    formatDate(date) {
      return formatDistance(subDays(new Date(date), 0), new Date(), { locale: fr })
    },
    avatar() {
      if (localStorage.user && this.newAvatar == null) {
        let user = JSON.parse(localStorage.getItem('user'));
        this.userAvatar = user.avatar;
      }
      else if (this.newAvatar != null) {
        this.userAvatar = this.newAvatar
      }
    },
    CreatorPublication(userId) {
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
        PublicationDataService.like(id, data)
          .then(
            this.publications[index].like += 1,
            this.publications[index].stateLike = {
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
            this.publications[index].like -= 1,
            this.publications[index].stateLike = {
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
            this.publications[index].like += 1,
            this.publications[index].dislike += 1,
            this.publications[index].stateLike = {
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
        PublicationDataService.like(id, data)
          .then(
            this.publications[index].dislike -= 1,
            this.publications[index].stateLike = {
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
            this.publications[index].dislike += 1,
            this.publications[index].stateLike = {
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
            this.publications[index].like -= 1,
            this.publications[index].dislike -= 1,
            this.publications[index].stateLike = {
              disliked: true,
              liked: false
            }
          )
          .catch(e => {
            console.log(e.response.data);
          });
      }
    },
    addPublication(data) {
      this.publications.unshift(data)
    },
    editPublication(data) {
      this.publications[this.publicationEdit.index].message = data.message
      if (data.attachement) {
        this.publications[this.publicationEdit.index].attachement = data.attachement
      }
    },
    disactivePublication(data){
      this.publications[this.publicationDelete.index].message = data.message
      this.publications[this.publicationDelete.index].attachement = data.attachement
    },
    deletePublication() {
      this.publications.splice(this.publicationDelete.index, 1)
    },
    showPublish() {
      return this.publish = true;
    },
    closePublish(condition) {
      return this.publish = condition;
    },
    showEdit(id, message, attachement, index) {
      this.publicationEdit = { id, message, attachement, index }
      return this.edit = true;
    },
    closeEdit(condition) {
      return this.edit = condition;
    },
    showDelete(id, index) {
      this.publicationDelete = { id, index }
      return this.deleted = true
    },
    closeDelete(condition) {
      return this.deleted = condition;
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
.publish-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 30px;
  border: none;
  color: #2d3f5d;
  background-color: #00000000;
  &__img {
    object-fit: cover;
    border-radius: 50px;
    border: 2px solid #2d3f5d;
    background: #2d3f5d;
    width: 50px;
    height: 50px;
    margin-right: 20px;
  }
  &__title {
    font-size: 30px;
    color: #2d3f5d;
  }
}
.publications {
  font-family: "Roboto-Regular";
  font-size: 30px;
  padding-top: 50px;
  padding-bottom: 50px;
  width: 55%;
}
.publication-display {
  padding: 10px;
  margin-bottom: 20px;
  background: #2d3f5d;
  border-radius: 15px;
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
    border-radius: 80px;
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
.publication-options {
  width: 15%;
  display: flex;
  justify-content: space-between;
  &__button {
    cursor: pointer;
    background: #2d3f5d;
    border: none;
  }
  &__img {
    position: relative;
    top: -25px;
    height: 30%;
  }
}
.publication-content {
  padding: 1%;
  background-color: white;
  border-radius: 0px 0px 10px 10px;
  &__message {
    margin: 10px 0px 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  &__attachement {
    width: 100%;
    &--reduce {
      height: 400px;
      object-fit: cover;
      &:hover {
        height: initial;
      }
    }
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
.Top {
  position: fixed;
  right: 10%;
  top: 48%;
  width: 25%;
  font-size: 28px;
  background-color: #2d3f5d;
  &-display {
    font-family: "Roboto-Regular";
    margin: 10px 0px;
    color: white;
    text-align: center;
    display: flex;
    flex-direction: column;
  }
}
.best {
  margin: 10px;
  &__link {
    padding: 0;
    width: 100%;
    border: none;
    cursor: pointer;
    margin-top: 10px;
    display: flex;
    align-items: center;
    background-color: white;
  }
  &__avatar {
    margin: 5px 10px;
    object-fit: cover;
    border-radius: 50px;
    border: 1px solid #2d3f5d;
    width: 50px;
    height: 50px;
    background: #2d3f5d;
  }
  &__message {
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.best-contributor-logo {
  margin-left: 5px;
  width: 25px;
}
.horizontal-line {
  margin: 10px;
  background-color: white;
  height: 2px;
}
a {
  cursor: pointer;
  text-decoration: none;
  color: black;
}
@media (min-width: 1904px) {
  .home {
    padding-left: 250px;
  }
  .publish-button {
    &__img {
      border-radius: 80px;
      width: 80px;
      height: 80px;
    }
    &__title {
      font-size: 35px;
    }
  }
  .publications {
    font-size: 40px;
    width: 45%;
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
  .publication-content__attachement--reduce {
    height: 500px;
    object-position: 0px 10%;
  }
  .publication-footer {
    font-size: 30px;
    & img {
      width: 40px;
    }
  }
  .Top-display {
    font-size: 40px;
  }
  .best__avatar {
    border-radius: 100px;
    width: 100px;
    height: 100px;
  }
}
@media (min-width: 1264px) AND (max-width: 1904px) {
  .home {
    padding-left: 100px;
  }
}
@media (min-width: 960px) AND (max-width: 1264px) {
  .home {
    padding-left: 50px;
  }
  .publish-button__title {
    font-size: 20px;
  }
  .publications {
    font-size: 25px;
  }
  .publication-profil__avatar {
    border-radius: 70px;
    width: 70px;
    height: 70px;
  }
  .publication-date {
    font-size: 12px;
  }
  .publication-options {
    width: 20%;
    &__img {
      height: 25%;
    }
  }
  .publication-footer {
    font-size: 20px;
    & img {
      width: 25px;
    }
  }
  .Top {
    right: 5%;
    width: 30%;
    font-size: 20px;
  }
}
@media (min-width: 600px) AND (max-width: 960px) {
  .home {
    padding-left: 50px;
  }
  .publish-button__title {
    font-size: 20px;
  }
  .publications {
    font-size: 20px;
  }
  .publication-profil__avatar {
    margin-right: 15px;
    border-radius: 60px;
    width: 60px;
    height: 60px;
  }
  .publication-date {
    font-size: 12px;
    margin-top: 6px;
  }
  .publication-options {
    width: 20%;
    &__img {
      top: -20px;
      height: 25%;
    }
  }
  .publication-content__attachement--reduce {
    height: auto;
  }
  .publication-footer {
    font-size: 15px;
    & img {
      width: 20px;
      margin-right: 5px;
    }
  }
  .Top {
    right: 5%;
    width: 30%;
    font-size: 20px;
  }
  .best-contributor-logo {
    width: 20px;
  }
}
@media (max-width: 600px) {
  .home {
    padding-left: 0px;
  }
  .publish-button {
    margin: 20px auto 0px;
    &__img {
      border-radius: 40px;
      width: 40px;
      height: 40px;
    }
    &__title {
      font-size: 17px;
    }
  }
  .publications {
    width: 100%;
    padding-top: 20px;
    padding-bottom: 0px;
    font-size: 17px
  }
  .publication-profil__avatar {
    margin-right: 10px;
    border-radius: 50px;
    width: 50px;
    height: 50px;
  }
  .publication-date {
    font-size: 11px;
    margin-top: 5px;
    white-space: nowrap;
  }
  .publication-options {
    width: 25%;
    &__img {
      top: -20px;
    }
  }
  .publication-content__attachement--reduce {
    height: auto;
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
  .Top {
    position: sticky;
    z-index: 10;
    top: 0;
    width: 100%;
    font-size: 17px;
  }
  .Top-display {
    margin: 0;
    border: 5px solid white;
  }
  .best {
    margin: 5px;
    align-items: center;
    display: inline-flex;
    justify-content: space-between;
    &__link {
      margin: 0;
      width: 45%;
    }
    &__avatar {
      margin: 3px 3px;
      border-radius: 30px;
      width: 30px;
      height: 30px;
    }
    &-contributor-logo {
      width: 15px;
    }
  }
  .horizontal-line {
    margin: 0px;
  }
}
</style>