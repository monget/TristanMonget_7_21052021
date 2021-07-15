<template>
  <main>
    <Publish
      v-if="publish"
      @add-publication="addPublication($event)"
      v-on:closing-popup-publish="closePublish($event)"
    />
    <Edit
      v-if="edit"
      :id="publicationEdit.id"
      :message="publicationEdit.message"
      :attachement="publicationEdit.attachement"
      @edit-publication="editPublication($event)"
      v-on:closing-popup-edit="closeEdit($event)"
    />
    <Delete
      v-if="deleted"
      message="publication"
      :id="publicationDelete.id"
      @delete-publication="deletePublication()"
      v-on:closing-popup-delete="closeDelete($event)"
    />
    <div class="home" >
      <button class="publish__button" v-if="connected" @click="showPublish()">
        <img :src="userAvatar">
        Publiez quelque chose...
      </button>
      <div class="publication">
        <div class="publication__wrap" v-for="(publication, index) in publications" :key="index">
          <div class="publication__head">
            <a class="profil" :href="'profil/' + publication.userId">
              <img class="profil__avatar" :src="publication.avatar" :title="publication.publishedBy">
              {{ publication.publishedBy }} .{{ formatDate(publication.createdAt) }}
            </a>
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
            <a :href="'publication/' + publication.id">
              <p class="content__message">
                {{ publication.message }}
              </p>
              <img v-if="publication.attachement" class="content__attachement" :src="publication.attachement">
            </a>
            <div class="content__footer">
              <div class="like">
                <div>
                  <button @click="liked(publication.id, index)">
                    <img src="../assets/icons/thumbs-up-regular.svg">
                  </button>
                  {{ publication.like }}
                </div>
                <div>
                  <button @click="disliked(publication.id, index)">
                    <img src="../assets/icons/thumbs-down-regular.svg">
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
            <div class="best__detail">
              {{ topPublicationId }}
            </div>
          </div>
          <div class="horizontal_line"></div>
          <div class="best">
            <span>Contributeur au <img src="../assets/icons/hand-point-up-solid.svg"></span>
            <div class="best__detail"></div>
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
      topPublicationId: null,
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
          this.publications.forEach(publication => {
            bestPublication.push(publication.id)
            countlikes.push(publication.like)
          });
          const indexOfMaxValue = countlikes.indexOf(Math.max(...countlikes));
          this.topPublicationId = bestPublication[indexOfMaxValue]
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
    liked(id, index) {
      const data = {
        like: 1
      }
      PublicationDataService.like(id, data)
        .then(
          this.publications[index].like += 1
        )
        .catch(e => {
          console.log(e.response.data);
        });
    },
    disliked(id, index) {
      const data = {
        like: -1
      }
      PublicationDataService.like(id, data)
        .then(response => {
          this.publications[index].dislike -= 1
          console.log(response)       
        })
        .catch(e => {
          console.log(e.response);
        });
    },
    addPublication(data) {
      this.publications.unshift(data)
    },
    editPublication(data) { // A finir car problème de mutation (voir computed)
      console.log(data)
      console.log(this.publicationEdit)
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
    border-radius: 16px;
  }
  &__head {
    display: flex;
    justify-content: space-between;
  }
  &__options {
    width: 20%;
    display: flex;
    justify-content: space-between;
    & button {
      cursor: pointer;
      background: #909090;
      border: none;
      & img {
        height: 30px;
      }
    }
  }
}
.profil  {
  display: flex;
  align-items: center;
  &__avatar {
    object-fit: cover;
    border-radius: 30px;
    border: 1px solid;
    width: 50px;
    height: 50px;
    margin-right: 20px;
  }
}
.content {
  margin: 0px 15px;
  &__message {
    margin: 10px 0px 20px;
    color: white;
  }
  &__attachement {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }
  &__footer {
    font-size: 25px;
    display: flex;
    margin: 5px 0px;
    justify-content: space-between;
    & div {
      display: flex;
      color: white;
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
    background-color: #909090;
  }
}
a {
  cursor: pointer;
  text-decoration: none;
  color: black;
}
.onTop {
  position: fixed;
  right: 15%;
  top: 48%;
  width: 296px;
  border: 2px solid white;
  &__content {
    font-family: "Roboto-Regular";
    font-size: 28px;
    margin: 10px 0px;
    color: #ff7c03;
    text-align: center;
    display: grid;
  }
}
.best {
  margin: 10px;
  & img {
    width: 25px;
  }
  &__detail {
    width: 100%;
    height: 60px;
    margin-top: 10px;
    background-color: white;
  }
}
.horizontal_line {
  margin: 10px;
  background-color: white;
  height: 1px;
}
</style>