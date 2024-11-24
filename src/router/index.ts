import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue'
import Login from '../views/Account/Login.vue'
import SignUp from '../views/Account/SignUp.vue'
import ReviewList from '../views/Review/ReviewList.vue'
import MyPage from '@/views/Account/MyPage.vue'
import Map from '@/views/Map/Map.vue'
import Search from '@/views/Search/Search.vue'
import CrewCreate from '@/views/Crew/CrewCreate.vue'
import CrewPage from '@/views/Crew/CrewPage.vue'
import Chat from '@/views/Chat/Chat.vue'
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
    path: '/search',
    name: 'Search',
    component: Search,
  },
  {
    path: '/crewCreate',
    name: 'CrewCreate',
    component: CrewCreate,
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
