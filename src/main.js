import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { EventBus } from '@/EventBus';
import axios from 'axios';

library.add(fas)

const app = createApp(App).use(store)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(store)
app.use(router)
app.config.globalProperties.productionTip = false
app.config.globalProperties.$EventBus = EventBus;
app.config.globalProperties.$axios = axios;
app.mount('#app')
