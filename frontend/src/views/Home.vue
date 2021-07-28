<template>
  <main class="main" role="main" aria-label="main">
    <div class="home">
      <h1>Bienvenue sur Groupomania</h1>
      <p>Veuillez vous 
        <router-link to="/connection">connecter</router-link>
        pour accéder à l'application !
      </p>
      <p>Si vous n'avez pas déjà de compte vous pouvez le créér 
        <router-link to="/registration">ici !</router-link>
      </p>
    </div>
  </main>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="scss" scoped>
.home {
  text-align: center;
  position: relative;
  top: 40%;
  transform: translateY(-50%);
}
h1 {
  font-size: 90px;
}
p {
  font-size: 35px;
  & a {
    cursor: pointer;
    font-weight: bolder;
    text-decoration: none;
    color: blue;
  }
}
@media (min-width: 1904px) {
  h1 {
    font-size: 150px;
  }
  p {
    font-size: 60px;
  }
}
@media (min-width: 960px) AND (max-width: 1264px) {
  h1 {
    font-size: 70px;
  }
  p {
    font-size: 25px;
  }
}
@media (min-width: 600px) AND (max-width: 960px) {
  h1 {
    font-size: 50px;
  }
  p {
    font-size: 20px;
  }
}
@media (max-width: 600px) {
  .home {
    width: 90%;
    margin: auto;
  }
   h1 {
    font-size: 35px;
  }
  p {
    font-size: 14px;
  }
}
</style>