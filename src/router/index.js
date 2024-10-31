import { createRouter, createWebHistory } from 'vue-router';
import Main from '../views/Main.vue';
import Test from '../views/Test.vue';
import ReviewList from '../views/Review/ReviewList.vue';
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
        path: '/reviewList',
        name: 'ReviewList',
        component: ReviewList,
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
