// eslint-disable-next-line
/* eslint-disable */

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ReviewBoard from '../views/ReviewBoard.vue'
import RecommendFood from '../components/RecommendFood.vue' 
import RecommendListFood from '../components/RecommendListFood.vue' 
import RecommendHotel from '../components/RecommendHotel.vue' 
import RecommendList from '../views/RecommendList.vue'
//import RecommendList from '../views/RecommendListPlace.vue' 

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/reviews',
    name: 'reviews',
    component: ReviewBoard
  },
  {
    path: '/list',
    name: 'RecommendList',
    component: RecommendList
  },
  {
    path: '/food',
    name: 'food',
    component: RecommendFood
  },
  {
    path: '/listfood',
    name: 'listfood',
    component: RecommendListFood
  },
  {
    path: '/hotel',
    name: 'hotel',
    component: RecommendHotel
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
