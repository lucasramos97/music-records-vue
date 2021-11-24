import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Login from '@/components/users/Login.vue';
import MusicList from '@/components/musics/MusicList.vue';
import AuthenticationService from '@/services/AuthenticationService';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: MusicList,
  },
  {
    path: '/musics',
    component: MusicList,
  },
  {
    path: '/login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const authenticationService = new AuthenticationService();
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !authenticationService.isAuthenticated())
    next({ path: '/login' });
  else next();
});

export default router;
