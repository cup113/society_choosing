import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ThanksView from '@/views/ThanksView.vue';
import ChooseView from '@/views/ChooseView.vue';
import AboutView from '@/views/AboutView.vue';
import ExportView from '../views/ExportView.vue';
import ReviewView from '@/views/ReviewView.vue';

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
      path: '/export',
      name: 'export',
      component: ExportView,
    },
    {
      path: '/review',
      name: 'review',
      component: ReviewView,
    }
  ]
})

export default router
