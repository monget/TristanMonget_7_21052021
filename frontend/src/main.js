import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { ValidationProvider, ValidationObserver } from 'vee-validate';
import './services/ValidationForm'

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
