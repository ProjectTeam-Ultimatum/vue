import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { far } from '@fortawesome/free-regular-svg-icons'

// Axios 인스턴스 생성 및 설정
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080'
});

axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('Authorization'); // 여기를 수정
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const app = createApp(App);
library.add(fas, far)

app.config.globalProperties.$axios = axiosInstance; // 이 부분은 이미 설정되었으므로, 이 줄만 필요
app.use(store).use(router).mount('#app');
app.component('font-awesome-icon', FontAwesomeIcon)
