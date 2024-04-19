import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import ReviewBoard from '../views/Review/ReviewBoard.vue'
import ChattingView from '../views/Chat/ChattingView.vue'
import ChatRoom from '../views/Chat/ChatRoom.vue';
import BudgetView from '../views/Budget/BudgetView.vue';


const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/reviews',
    name: 'reviews',
    component: ReviewBoard
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