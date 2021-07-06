<template>
  <div>
    <Header button="Inscription"/>
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
  width: 100%;
  margin: 0;
}
</style>

