<template>
  <div>
    <footer>
      <div>
        <nav>
          <ul>
            <li><router-link to="#">Conditions générales</router-link></li>
            <li><router-link to="#">Confidentialité</router-link></li>
            <li><router-link to="#">Contact</router-link></li>
          </ul>
        </nav>
        <nav class="copyright">© Groupomania 2021</nav>
      </div>
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
  width: 350px;
  height: 250px;
  right: 10%;
  top: 15%;
  font-weight: 400;
  font-size: 20px;
  background-color: white;
  & div {
    display: flex;
    flex-direction: column;
    padding: 20px;
    justify-content: space-between;
    height: 100%;
  }
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