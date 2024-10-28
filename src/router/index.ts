import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue'
import Test from '../views/Test.vue'

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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
