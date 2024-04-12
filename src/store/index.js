import Vuex from 'vuex';

export default new Vuex.Store({
    state: {
        curLonCopy: undefined,
        curLatCopy: undefined,
        curMapId: undefined,
        curTitle: undefined,
        curAddress: undefined,
        curGrade: undefined,
        curReview: undefined,
        review: null,
        inputState: false,
    },
    mutations: {
        setReview(state, review) {
            state.review = review;
          },
          setInputState(state, status) {
            state.inputState = status;
          },
        setMaps: (state, maps) => {
            state.maps = maps;
        },
        setLonLat: (state, { lonCopy, latCopy }) => {
            state.curLonCopy = lonCopy;
            state.curLatCopy = latCopy;
        },
        setCurMapId: (state, id) => {
            state.curMapId = id;
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
        setMap: (state, map) => {
            state.curMapId = map ? map.id : map;
            state.curLatCopy = map ? map.latCopy : map;
            state.curLonCopy = map ? map.lonCopy : map;
            state.curTitle = map ? map.title : map;
            state.curGrade = map ? map.grade : map;
            state.curAddress = map ? map.address : map;
            state.curReview = map ? map.review : map;
        }
    },
    actions: {
      
    },
    modules: {}
});
