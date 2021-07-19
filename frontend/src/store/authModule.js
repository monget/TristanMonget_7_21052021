import AuthService from '../services/AuthService';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    async login({ commit }, user) {
      try {
        const user_2 = await AuthService.login(user);
        if (user_2.token) {
          commit('loginSuccess', user_2);
          return Promise.resolve(user_2);
        }
      } catch (e) {
        commit('loginFailure');
        return await Promise.reject(e);
      }
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
    async signup({ commit }, user) {
      try {
        const response = await AuthService.signup(user);
        if (user.token) {
          commit('signupSuccess');
          return Promise.resolve(response.data);
        }
      } catch (e) {
        commit('signupFailure');
        return await Promise.reject(e);
      }
    }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    signupSuccess(state) {
      state.status.loggedIn = true;
      state.user = user;
    },
    signupFailure(state) {
      state.status.loggedIn = false;
    }
  }
};