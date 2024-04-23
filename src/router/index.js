// eslint-disable-next-line
/* eslint-disable */

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ReviewBoard from '../views/ReviewBoard.vue'
import RecommendList from '../views/Recommend/RecommendList.vue'
import RecommendListFood from '../components/RecommendList/RecommendListFood.vue' 
import RecommendListHotel from '../components/RecommendList/RecommendListHotel.vue' 
import RecommendListPlace from '../components/RecommendList/RecommendListPlace.vue' 
import RecommendListEvent from '../components/RecommendList/RecommendListEvent.vue' 
import RecommendDetail from '../views/Recommend/RecommendDetail.vue'
//import RecommendDetailFood from '../components/RecommendDetail/RecommendDetailFood.vue'
import RecommendDetailFood from '../components/RecommendDetail/RecommendDetailFood.vue'
import RecommendDetailPlace from '../components/RecommendDetail/RecommendDetailPlace.vue'
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
    path: '/listfood',
    name: 'listfood',
    component: RecommendListFood
  },
  {
    path: '/listplace',
    name: 'listplace',
    component: RecommendListPlace
  },
  {
    path: '/listhotel',
    name: 'listhotel',
    component: RecommendListHotel
  },
  {
    path: '/listevent',
    name: 'listevent',
    component: RecommendListEvent
  },
  {
    path: '/detail',
    name: 'recommenddetail',
    component: RecommendDetail
  },
  {
    path: '/detailfood/:recommendFoodId',
    name: 'detailfood',
    component: RecommendDetailFood,
    props: true  // 이를 통해 라우트 파라미터를 prop으로 전달합니다.
  },
  {
    path: '/detailplace/:recommendPlaceId',
    name: 'detailplace',
    component: RecommendDetailPlace,
    props: true
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
