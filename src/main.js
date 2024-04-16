import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { far } from '@fortawesome/free-regular-svg-icons'


//axios 인스턴스 생성
const axiosInstance = axios.create({ baseURL: 'http://localhost:8080' });
const app = createApp(App);
library.add(fas, far)

app.config.globalProperties.$axios = axiosInstance;
app.use(store).use(router).mount('#app');
app.component('font-awesome-icon', FontAwesomeIcon)


axios.defaults.baseURL = 'http://localhost:8080';
axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('Authorization');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

