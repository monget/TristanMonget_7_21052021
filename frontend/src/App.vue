<template>
  <div class="display">
    <Header/>
    <router-view/>
    <FooterAside/>
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
.display {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
</style>

