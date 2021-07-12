<template>
  <div>
    <footer>
      <nav>
        <ul>
          <li><a href="#">Conditions générales</a></li>
          <li><a href="#">Confidentialité</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
      <nav class="copyright">© Groupomania 2021</nav>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'FooterAside'
}
</script>

<style lang="scss">
footer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  height: 200px;
  right: 15%;
  top: 15%;
  font-weight: 400;
  font-size: 20px;
  padding: 20px 80px 20px 30px;
  background-color: white;
  & ul {
    margin: 0px;
    padding-left: 0px;
  }
  & ul > li {
    list-style-type: none;
    margin-bottom: 15px;
    text-align: left;
    & a {
      color: black;
      text-decoration: none;
    }
  }
}
</style>