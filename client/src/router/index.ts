import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ThanksView from '@/views/ThanksView.vue';
import ChooseView from '@/views/ChooseView.vue';
import AboutView from '@/views/AboutView.vue';
import ExportView from '../views/ExportView.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
      path: '/export',
      name: 'export',
      component: ExportView,
    }
  ]
})

export default router
