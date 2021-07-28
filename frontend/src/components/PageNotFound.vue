<template>
  <main class="main" role="main" aria-label="main">
    <div class="not-found">
      <h1>Oups...nous n'avons pas réussi à trouver cette page.</h1>
      <router-link class="back-home" to="/publications">Revenir au menu principal !</router-link>
    </div>
  </main>
</template>

<script>
export default {
  name: 'PageNotFound'
}
</script>

<style lang="scss" scoped>
.not-found {
  text-align: center;
  position: relative;
  top: 40%;
  transform: translateY(-50%);
}
h1 {
  font-size: 5em;
}
.back-home {
  font-size: 3em;
  text-decoration: none;
  cursor: pointer;
}
@media (min-width: 1904px) {
  h1 {
    font-size: 150px;
  }
  .back-home {
    font-size: 60px;
  }
}
@media (min-width: 960px) AND (max-width: 1264px) {
  h1 {
    font-size: 55px;
  }
  .back-home {
    font-size: 25px;
  }
}
@media (min-width: 600px) AND (max-width: 960px) {
  h1 {
    font-size: 35px;
  }
  .back-home {
    font-size: 20px;
  }
}
@media (max-width: 600px) {
  .not-found {
    width: 90%;
    margin: auto;
  }
   h1 {
    font-size: 25px;
  }
  .back-home {
    font-size: 14px;
  }
}
</style>