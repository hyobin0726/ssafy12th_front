import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue'
import Test from '../views/Test.vue'
import Login from '../views/Login/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
