import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ReviewBoard from '../views/ReviewBoard.vue'
import MonthCalendar from '../views/schedule/MonthCalendar.vue'
import PlanCourse from '../views/schedule/PlanCourse.vue'


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
  path: '/schedule',
    name: 'schedule',
    component: MonthCalendar
  },
  {
    path: '/plancourse',
      name: 'plancourse',
      component: PlanCourse
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
