import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons';
//import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
//import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas, far)
//library.add(far)
//library.add(farHeart);

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.use(store).use(router).mount('#app');
app.component('font-awesome-icon', FontAwesomeIcon)