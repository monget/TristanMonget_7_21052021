<template>
  <main>
    <div class="home">
      <div class="publish">
      </div>
      <div class="publication">
        <div class="publication__wrap">
          <div class="publication__head">
            <a class="profil" :href="'../profil/' + publication.userId">
              <img class="publication__avatar" :src="publication.avatar">
              {{ publication.publishedBy }} . {{ formatDate(createdAt) }}
            </a>
            <button class="publication__close" @click="close()">
              <img src="../assets/icons/times-solid.svg">
            </button>
          </div>
          <div class="content">
            <p class="content__title">
              {{ publication.message }}
            </p>
            <img v-if="publication.attachement" class="content__attachement" :src="publication.attachement">
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
  background-color: white;
}
.publish {
  & button {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-top: 50px;
    background-color: white;
    border: none;
    font-size: 30px;
    color: #909090;
    & img {
      object-fit: cover;
      border-radius: 30px;
      border: 1px solid;
      width: 50px;
      height: 50px;
      margin-right: 20px;
    }  
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
    & a {
      display: flex;
      align-items: center;
    }
  }
  &__avatar {
    object-fit: cover;
    border-radius: 30px;
    border: 1px solid;
    width: 50px;
    height: 50px;
    margin-right: 20px;
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
.content {
  margin: 0px 15px;
  &__title {
    margin: 5px 0px;
    color: white;
  }
  &__attachement {
    width: 100%;
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
</style>