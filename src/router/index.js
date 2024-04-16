import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ReviewBoard from '../views/Review/ReviewBoard.vue'
import LogIn from '../views/Login/LogIn.vue'
import ChattingView from '../views/Chat/ChattingView.vue'
import ChatRoom from '../views/Chat/ChatRoom.vue';
import BudgetView from '../views/Budget/BudgetView.vue';


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
  {
    path: '/chatting',
    name: 'chatting',
    component: ChattingView
  },
  {
    path: '/chat/room/:roomId', // 동적 세그먼트를 사용한 경로
    name: 'ChatRoom',
    component: ChatRoom,
    props: true // 컴포넌트에 URL 파라미터를 props로 전달
  },
  {
    path: '/budget',
    name: 'budget',
    component: BudgetView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router