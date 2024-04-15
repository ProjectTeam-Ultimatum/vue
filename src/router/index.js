import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainMap from '../components/MainMap.vue'
import Place from '../components/Place.vue'
import Hotel from '../components/Hotel.vue'
import Event from '../components/Event.vue'
import Food from '../components/Food.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/mainmap',
    name: 'MainMap',
    component: MainMap
  },
  {
    path: '/place',
    name: 'place_category',
    component: Place
  },
  {
    path: '/hotel',
    name: 'hotel_category',
    component: Hotel
  },
  {
    path: '/event',
    name: 'event_category',
    component: Event
  },
  {
    path: '/food',
    name: 'food_category',
    component: Food
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
