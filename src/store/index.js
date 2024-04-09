import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    reviews: undefined,
    curLon: undefined,
    curLat: undefined,
    curReviewId: undefined,
    curTitle: undefined,
    curAddress: undefined,
    curGrade: undefined,
    curReview: undefined,
  },
  getters: {
  },
  mutations: {
    setReviews: (state, reviews) => {
      state.reviews = reviews;
  },
    setLonLat: (state, { lon, lat }) => {
      state.curLon = lon;
      state.curLat = lat;
  },
    setCurReviewId: (state, id) => {
      state.curReviewId = id;
  },
    setCurTitle: (state, title) => {
      state.curTitle = title;
  },
    setCurAddress: (state, address) => {
      state.curAddress = address;
  },
    setCurGrade: (state, grade) => {
      state.curGrade = grade;
  },
    setCurReview: (state, review) => {
      state.curReview = review;
  },
  },
  actions: {
    async setReviews({commit}, that) {
      await process(that, async () => {
          const result = await axios.get('/api/map/saveMap');
          await commit('setMap', result.data);
      })
  }
  },
  modules: {
  }
})
