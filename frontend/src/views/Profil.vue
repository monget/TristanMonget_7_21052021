<template>
  <main>
    <div class="profil">
      <div class="profil__wrap">
        <div class="info">
          <div>
            <p>Pseudo :</p>
            <p class="info__value">{{ pseudo }}</p>
          </div>
          <div>
            <p>Email :</p>
            <p class="info__value">{{ email }}</p>
          </div>
          <div>
            <p>Date de naissance :</p>
            <p class="info__value">../../..</p>
          </div>
          <div>
            <p>Poste occupé :</p>
            <p class="info__value"></p>
          </div>
          <p>Descriptif :</p>
          <textarea></textarea>
          <button class="editProfil"><router-link to="/profil">Modifier le profil</router-link></button>
        </div>
      </div>
    </div>
    <aside>
      <button>Supprimer le profil</button>
    </aside>
  </main>
</template>

<script>
import UserDataService from "../services/UserDataService";

export default {
  name: "Profil",
  data() {
    return {
      id: null,
      pseudo: null,
      email: null,
      createdAt: null,
      updatedAt: null
    };
  },
  beforeMount() {
    this.setup(this.$route.params.id);
  },
  methods: {
    setup(id) {
      UserDataService.find(id)
        .then(response => {
          this.id = response.data.id,
          this.pseudo = response.data.pseudo,
          this.email = response.data.email,
          this.createdAt = response.data.createdAt,
          this.updatedAt = response.data.updatedAt,
          console.log(response.data)
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>


<style lang="scss" scoped>
@font-face {
  font-family: "Roboto-Medium";
  src: local("Roboto-Medium"),
  url(../fonts/Roboto-Medium.ttf) format("truetype");
}
.profil {
  font-family: "Roboto-Medium";
  padding-top: 50px;
  padding-bottom: 50px;
  padding-left: 30px;
  &__wrap {
    font-size: 30px;
    padding: 0 2% 2%;
    width: 55%;
    background-color: white;
    border-radius: 30px;
  }
}
.info {
  &__value {
    margin-left: 5px;
  }
  & div {
    display: flex;
  }
} 
h1 {
  margin: 0px;
  font-family: "Roboto-Medium";
  font-weight: 500;
  font-size: 45px;
  text-align: center;
  padding: 15px 0;
}
p {
  margin: 10px 0;
}
textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 20px;
  box-sizing: border-box;
  background-color: #ecebeb;
}
.editProfil {
  font-family: "Roboto-Medium";
  font-size: 25px;
  display: block;
  width: 35%;
  margin: auto;
  font-weight: bold;
  color: white;
  background-color: #3B47B2;
}
a {
  text-decoration: none;
  color: white;
}
@media (max-width: 425px) {
  .profil__wrap {
    padding: 5%;
    width: 65%;
  }
}
aside {
  position: fixed;
  right: 15%;
  top: 57%;
  font-weight: 400;
  & button {
    cursor: pointer;
    padding: 20px 24px;
    background-color: #C71010;
    border: 2px solid white;
    font-family: "Roboto-Medium";
    font-size: 30px;
    margin: auto;
    color: white;
  }
}

</style>