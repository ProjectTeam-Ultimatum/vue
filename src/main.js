import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios';
import { EventBus } from '@/EventBus';

const app = createApp(App);

app.use(store).use(router).use(VueAxios, axios).mount('#app');
app.config.globalProperties.$EventBus = EventBus;
app.config.globalProperties.$http = axios;



