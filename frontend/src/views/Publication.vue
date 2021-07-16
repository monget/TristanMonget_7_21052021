<template>
  <main>
    <div class="home">
      <div class="publication">
        <div class="publication__wrap">
          <div class="publication__head">
            <div class="profil">
              <a class="profil__link" :href="'../profil/' + publication.userId">
                <img class="profil__avatar" :src="publication.avatar" :title="publication.publishedBy">
                <span>{{ publication.publishedBy }}</span>
              </a>
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
                  <button @click="liked(publication.id)"><img src="../assets/icons/thumbs-up-regular.svg"></button>
                  {{ publication.like }}
                </div>
                <div>
                  <button @click="disliked(publication.id)"><img src="../assets/icons/thumbs-down-regular.svg"></button>
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
    </div>
  </main>
</template>

<script>
import PublicationDataService from "../services/PublicationDataService";
import { formatDistance, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'

export default {
  name: 'Publication',
  data() {
    return {
      publication: [],
      createdAt: null,
    };
  },
  beforeMount() {
    this.setup(this.$route.params.id);
  },
  methods: {
    setup(id) {
      PublicationDataService.findOne(id)
        .then(response => {
          this.publication = response.data,
          this.createdAt = response.data.createdAt
        })
        .catch(e => {
          console.log(e);
        });
    },
    formatDate(date) {
      return formatDistance(subDays(new Date(date), 0), new Date(), { locale: fr })
    },
    access(userId) {
      if (localStorage.user) {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user.Id === userId) {
          return true
        }
      }
      return false
    },
    liked(id) {
      const data = {
        like: 1
      }
      PublicationDataService.like(id, data)
        .then(
          this.publication.like += 1
        )
        .catch(e => {
          console.log(e.response.data);
        });
    },
    disliked(id) {
      const data = {
        like: -1
      }
      PublicationDataService.like(id, data)
        .then(response => {
          this.publication.dislike -= 1
          console.log(response)       
        })
        .catch(e => {
          console.log(e.response);
        });
    },
    close() {
      this.$router.push('/');
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
    margin-bottom: 20px;
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
</style>