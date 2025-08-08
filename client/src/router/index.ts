import { createRouter, createWebHistory } from 'vue-router';
import { routeConfig, config_to_record } from './route-config';
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeConfig.map(config_to_record),
});

// 添加路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  const targetRoute: any = routeConfig.find(route =>
    route.name === to.name || route.path === to.path
  );

  if (targetRoute?.meta?.requiresAuth && !userStore.token) {
    next({ name: 'home' });
    return;
  }

  if (targetRoute?.meta?.roles && !targetRoute.meta.roles.includes(userStore.userInformation.role)) {
    if (targetRoute.meta.roles.includes('')) {
      next();
      return;
    }

    next({ name: 'home' });
    return;
  }

  next();
});

export default router;
