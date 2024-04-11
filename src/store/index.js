import Vuex from 'vuex';

export default new Vuex.Store({
    state: {
        maps: undefined,
        curLon: undefined,
        curLat: undefined,
        curMapId: undefined,
        curTitle: undefined,
        curAddress: undefined,
        curGrade: undefined,
        curMap: undefined,
    },
    mutations: {
        setMaps: (state, maps) => {
            state.maps = maps;
        },
        setLonLat: (state, { lon, lat }) => {
            state.curLon = lon;
            state.curLat = lat;
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
        setCurMap: (state, map) => {
            state.curMap = map;
        },
    },
    actions: {
      
    },
    modules: {}
});
