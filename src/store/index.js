import { createStore } from 'vuex'

const socket = {
  namespaced: true,
  state: () => ({
    connection: null, // WebSocket connection
    isConnected: false,
    messages: [],
  }),
  mutations: {
    SOCKET_CONNECT(state) {
      state.isConnected = true;
    },
    SOCKET_DISCONNECT(state) {
      state.isConnected = false;
    },
    SOCKET_MESSAGE(state, message) {
      state.messages.push(message);
    },
  },
  actions: {
    connect({ commit }) {
      const ws = new WebSocket('wss://example.com/socket');
      ws.onopen = () => {
        commit('SOCKET_CONNECT');
      };
      ws.onmessage = (event) => {
        commit('SOCKET_MESSAGE', event.data);
      };
      ws.onclose = () => {
        commit('SOCKET_DISCONNECT');
      };
      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        commit('SOCKET_DISCONNECT');
      };
      this.state.connection = ws;
    },
    disconnect({ state }) {
      if (state.connection) {
        state.connection.close();
      }
    },
    sendMessage({ state }, message) {
      if (state.connection && state.isConnected) {
        state.connection.send(message);
      }
    }
  }
}

export default createStore({
    modules: {
      auth: {
        state: {
          token: localStorage.getItem('token') // 로컬 스토리지에서 토큰 로드
        },
        getters: {
          token: state => state.token
        },
        mutations: {
          SET_TOKEN(state, token) {
            state.token = token;
            localStorage.setItem('token', token); // 로컬 스토리지에 저장
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
      },
      socket // socket 모듈을 추가
    }
});
