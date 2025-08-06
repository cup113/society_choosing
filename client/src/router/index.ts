import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ThanksView from '@/views/ThanksView.vue';
import ChooseView from '@/views/ChooseView.vue';
import AboutView from '@/views/AboutView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/choose',
      name: 'choose',
      component: ChooseView,
    },
    {
      path: '/thanks',
      name: 'thanks',
      component: ThanksView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/AdminView.vue'),
      children: [
        {
          path: '',
          name: 'UserManagement',
          component: () => import('@/views/AdminUserManagement.vue'),
        },
        {
          path: 'dates',
          name: 'DateManagement',
          component: () => import('@/views/AdminDateManagement.vue'),
        },
        {
          path: 'societies',
          name: 'SocietyManagement',
          component: () => import('@/views/AdminSocietyManagement.vue'),
        }
      ]
    },
  ]
})

export default router;
