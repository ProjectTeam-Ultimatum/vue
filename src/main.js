import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';
axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('Authorization');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

createApp(App).use(store).use(router).mount('#app')
