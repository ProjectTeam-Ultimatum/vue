import { createStore } from 'vuex'

export default createStore({
    state: {
    },
    getters: {
    },
    mutations: {
        savePlanInfo(state, payload) {
            state.planInfo = payload;
        }
    },
    actions: {
    },
    modules: {
    }
})