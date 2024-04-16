import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ReviewBoard from '../views/Review/ReviewBoard.vue'
import LogIn from '../views/Login/LogIn.vue'




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
    path: '/login',
    name: 'login',
    component: LogIn
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
