import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)


const app = createApp(App);

app.use(store).component('font-awesome-icon', FontAwesomeIcon).use(router).use(VueAxios, axios).mount('#app');

app.config.globalProperties.$http = axios;



