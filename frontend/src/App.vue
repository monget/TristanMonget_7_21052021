<template>
  <div>
    <div id="turn">
      <h1>Cette application est prévu pour être utilisé en mode portrait.</h1>
      <p>Merci de tourner votre smarthpone</p>
    </div>
    <div id="display">
      <Header/>
      <router-view/>
      <FooterAside/>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import FooterAside from '@/components/FooterAside.vue'

export default {
  name: "App",
  components: {
    Header,
    FooterAside
  },
  created() {
    const html = document.documentElement // returns the html tag
    html.setAttribute('lang', 'fr')
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: "Roboto-Thin";
  src: local("Roboto-Thin"),
  url(./fonts/Roboto-Thin.ttf) format("truetype");
}
body {
  background-color: rgba(209, 209, 209, 0.65);
  font-family: "Roboto-Thin";
  margin: 0;
}
#display {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
@media (min-width: 850px) {
  #turn {
    display: none;
  }
}
@media (max-width: 850px) and (orientation:landscape){
  #turn {
    display: block;
    text-align: center;
    position: relative;
    top: 50%;
    transform: translateY(50%);
    width: 90%;
    margin: auto;
    & p {
      font-size: 25px;
    }
  }
  #display {
    display: none;
  }
}
@media (max-width: 850px) and (orientation:portrait){
  #turn {
    display: none;
  }
  #display {
    display: grid;
  }
}
</style>

