import Vue from 'vue'
import Vuex from 'vuex'
import { auth } from './authModule'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    avatar: null
  },
  mutations: {
    CHANGE_AVATAR(state, paylod) {
      state.avatar = paylod
    }
  },
  actions: {
  },
  modules: {
    auth
  }
})
