<template>
  <div>
    <button>Publiez quelque chose...</button>
    <div class="publication">
      <div class="publication__wrap" v-for="publication in publications" :key="publication.id">
        <a href="#">
        <div class="publication__head">
          <div>
            {{ publication.publishedBy }} le {{ publication.createdAt }} à {{  }}
          </div>
          <button>...</button>
        </div>
        <p class="publication__title">
          {{ publication.title }}
        </p>
        <div class="publication__attachement">image</div>
        <div class="publication__footer">
          <div class="publication__like">
            <div>
              like {{ publication.like }}
            </div>
            <div>
              dislike {{ publication.dislike }}
            </div>
          </div>
          <div>
            {{ publication.totalComments }} commentaires
          </div>
        </div>
        </a>
      </div>
    </div>
    <!-- <HelloWorld msg="Bienvenue sur Groupomania"/> -->
  </div>
</template>

<script>
//import HelloWorld from '@/components/HelloWorld.vue'
import PublicationDataService from "../services/PublicationDataService";

export default {
  name: 'Home',
  /*components: {
    HelloWorld
  }*/
  data() {
    return {
      publications: []
/*
      id: null,
      title: null,
      message: null,
      attachement: null,
      like: null,
      dislike: null,
      createdAt: null,
      updatedAt: null,
      userId: null,
      publishedBy: null,
      totalComments: null
*/
    };
  },
  beforeMount() {
    this.setup();
  },
  methods: {
    setup() {
      PublicationDataService.findAll()
        .then(response => {
          this.publications = response.data         
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: "Roboto-Thin";
  src: local("Roboto-Thin"),
  url(../fonts/Roboto-Thin.ttf) format("truetype");
}

.publication {
  font-size: 25px;
  padding-top: 50px;
  padding-bottom: 50px;
  padding-left: 60px;
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
  &__title {
    margin: 5px 10px;
  }
  &__attachement {
    margin: 0px 10px;
  }
  &__footer {
    display: flex;
    justify-content: space-between;
  }
  &__like {
    display: flex;
    width: 25%;
    justify-content: space-between;
  }
}
a {
  cursor: pointer;
  text-decoration: none;
  color: black;
}
</style>