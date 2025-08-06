import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ThanksView from '@/views/ThanksView.vue';
import ChooseView from '@/views/ChooseView.vue';
import AboutView from '@/views/AboutView.vue';
import DashboardView from '@/views/DashboardView.vue';
import AdminView from '@/views/AdminView.vue';
import AdminUserManagement from '@/views/AdminUserManagement.vue';
import AdminDateManagement from '@/views/AdminDateManagement.vue';
import AdminSocietyManagement from '@/views/AdminSocietyManagement.vue';

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
      component: DashboardView,
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminView,
      children: [
        {
          path: '',
          name: 'UserManagement',
          component: AdminUserManagement,
        },
        {
          path: 'dates',
          name: 'DateManagement',
          component: AdminDateManagement,
        },
        {
          path: 'societies',
          name: 'SocietyManagement',
          component: AdminSocietyManagement,
        }
      ]
    },
  ]
})

export default router