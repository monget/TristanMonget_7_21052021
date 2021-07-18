<template>
  <main>
    <Publish
      v-if="publish"
      @add-publication="addPublication($event)"
      @closing-popup-publish="closePublish($event)"
    />
    <Edit
      v-if="edit"
      :id="publicationEdit.id"
      :message="publicationEdit.message"
      :attachement="publicationEdit.attachement"
      @edit-publication="editPublication($event)"
      @closing-popup-edit="closeEdit($event)"
    />
    <Delete
      v-if="deleted"
      message="publication"
      :id="publicationDelete.id"
      @delete-publication="deletePublication()"
      @closing-popup-delete="closeDelete($event)"
    />
    <div class="home" >
      <button class="publish__button" v-if="connected" @click="showPublish()">
        <img :src="userAvatar">
        Publiez quelque chose...
      </button>
      <div class="publication">
        <div class="publication__wrap" v-for="(publication, index) in publications" :key="index">
          <div class="publication__head">
            <div class="profil">
              <router-link class="profil__link" :to="'profil/' + publication.userId">
                <img class="profil__avatar" :src="publication.avatar" :title="publication.publishedBy">
                <span>{{ publication.publishedBy }}</span>
              </router-link>
              <span class="profil__date">.{{ formatDate(publication.createdAt) }}</span>
            </div>
            <div class="publication__options" v-if="access(publication.userId)">
              <button @click="showEdit(publication.id, publication.message, publication.attachement, index)">
                <img src="../assets/icons/edit-solid.svg">
              </button>
              <button @click="showDelete(publication.id, index)">
                <img src="../assets/icons/trash-alt-solid.svg">
              </button>
            </div>
          </div>
          <div class="content">
            <router-link :to="'publication/' + publication.id">
              <p class="content__message" v-if="publication.message" >
                {{ publication.message }}
              </p>
              <img class="content__attachement" v-if="publication.attachement" :src="publication.attachement">
            </router-link>
            <div class="content__footer">
              <div class="like">
                <div>
                  <button @click="liked(publication.id, index, publication.stateLike)">
                    <img v-if="publication.stateLike.liked" src="../assets/icons/thumbs-up-regular-green.svg">
                    <img v-else src="../assets/icons/thumbs-up-regular.svg">
                  </button>
                  {{ publication.like }}
                </div>
                <div>
                  <button @click="disliked(publication.id, index, publication.stateLike)">
                    <img v-if="publication.stateLike.disliked" src="../assets/icons/thumbs-down-regular-red.svg">
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
      </div>
      <div class="onTop">
        <div class="onTop__content">
          <div class="best">
            <span>Meilleure publication</span>
            <router-link class="best__detail" :to="'publication/' + topPublication.id">
              <img class="best__avatar" :src="topPublication.avatar">
              <div class="best__message"> 
                {{ topPublication.message }}
              </div>
            </router-link>
          </div>
          <div class="horizontal_line"></div>
          <div class="best">
            <span>Contributeur au
              <img class="best__logo" src="../assets/icons/hand-point-up-solid.svg">
            </span>
            <router-link class="best__detail" :to="'profil/' + topContributor.id">
              <img class="best__avatar" :src="topContributor.avatar">
              <div class="best__message"> 
                {{ topContributor.name }}
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import PublicationDataService from "../services/PublicationDataService";
import Publish from '@/components/Publish.vue'
import Edit from '@/components/Edit.vue'
import Delete from '@/components/Delete.vue'
import { formatDistance, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'

export default {
  name: 'Home',
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
      connected: false,
      userAvatar: null,
      deleted: false,
      publish: false,
      edit: false
    };
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
          console.log(e);
        });
    },
    formatDate(date) {
      return formatDistance(subDays(new Date(date), 0), new Date(), { locale: fr })
    },
    avatar() {
      if (localStorage.user) {
        let user = JSON.parse(localStorage.getItem('user'));
        this.userAvatar = user.avatar;
        this.connected = true;
      }
    },
    access(userId) {
      let user = JSON.parse(localStorage.getItem('user'));
      if (user.Id === userId) {
        return true
      }
      return false
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
.publish__button {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 50px;
  border: none;
  font-size: 30px;
  color: black;
  background-color: #00000000;
  & img {
    object-fit: cover;
    border-radius: 30px;
    border: 1px solid;
    width: 50px;
    height: 50px;
    margin-right: 20px;
  }  
}
.publication {
  font-family: "Roboto-Regular";
  font-size: 30px;
  padding-top: 50px;
  padding-bottom: 50px;
  width: 55%;
  &__wrap {
    padding: 10px;
    margin-bottom: 20px;
    background: #909090;
    border-radius: 15px;
  }
  &__head {
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
      background: #909090;
      border: none;
      & img {
        height: 20px;
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__attachement {
    width: 100%;
    height: 400px;
    object-fit: cover;
    &:hover {
      height: initial;
    }
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
.horizontal_line {
  margin: 10px;
  background-color: #909090;
  height: 1px;
}
</style>