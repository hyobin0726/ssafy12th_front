import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue'
import Login from '../views/Account/Login.vue'
import SignUp from '../views/Account/SignUp.vue'
import ReviewList from '../views/Review/ReviewList.vue'
import MyPage from '@/views/Account/MyPage.vue'
import Map from '@/views/Map/Map.vue'
import CrewStart from '@/components/Crew/CrewStart.vue'
import CrewPage from '@/views/Crew/CrewPage.vue'
import Chat from '@/views/Chat/Chat.vue'
import MainView from '@/views/MainView.vue'
import Nav from '@/views/Nav.vue'
const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/signUp',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/myPage',
    name: 'MyPage',
    component: MyPage,
  },
  {
    path: '/reviewList',
    name: 'ReviewList',
    component: ReviewList,
  },
  {
    path: '/map',
    name: 'Map',
    component: Map,
  },
  {
    path: '/crewStart',
    name: 'CrewStart',
    component: CrewStart,
  },
  {
    path: '/crewPage',
    name: 'CrewPage',
    component: CrewPage,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
  },
  {
    path: '/mainView',
    name: 'MainView',
    component: MainView,
  },
  {
    path: '/nav',
    name: 'Nav',
    component: Nav,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
