import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Login from '@/components/users/Login.vue';
import MusicList from '@/components/musics/MusicList.vue';
import DeletedMusicList from '@/components/musics/DeletedMusicList.vue';
import NotFound from '@/components/utils/NotFound.vue';
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
    path: '/musics/deleted',
    component: DeletedMusicList,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const authenticationService = new AuthenticationService();
router.beforeEach((to, from, next) => {
  if (to.matched && to.matched[0].path === '/:pathMatch(.*)*') next();
  else if (to.path !== '/login' && !authenticationService.isAuthenticated())
    next({ path: '/login' });
  else next();
});

export default router;
