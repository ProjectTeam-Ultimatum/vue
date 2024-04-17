import { createStore } from 'vuex'

export default createStore({
    state: {
      auth: {
        token: localStorage.getItem('token') // 로컬 스토리지에서 토큰 로드
      }
    },
    getters: {
      token: state => state.auth.token
    },
    mutations: {
      SET_TOKEN(state, token) {
        state.auth.token = token;
        localStorage.setItem('token', token); // 여기서 로컬 스토리지에 저장
      }
    },
    actions: {
      saveToken({ commit }, token) {
        commit('SET_TOKEN', token);
      },
      logout({ commit }) {
        commit('SET_TOKEN', null);
      }
    }
  });
  