import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Login from '@/components/users/Login.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
