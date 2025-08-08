import HomeView from '@/views/HomeView.vue';
import ThanksView from '@/views/ThanksView.vue';
import ChooseView from '@/views/ChooseView.vue';
import AboutView from '@/views/AboutView.vue';
import type { RouteRecordRaw } from 'vue-router';

interface RouteMeta {
  roles: string[]; // 允许访问的角色
  requiresAuth?: boolean; // 是否需要认证
}

interface RouteConfig {
  path: string;
  name: string;
  component: any;
  meta?: RouteMeta;
  children?: RouteConfig[];
}

export function config_to_record(config: RouteConfig): RouteRecordRaw {
  const record: RouteRecordRaw = {
    path: config.path,
    name: config.name,
    component: config.component,
    children: config.children?.map(config_to_record) ?? [],
    redirect: undefined,
  };

  return record;
}

export const routeConfig: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      roles: ['student', 'teacher', ''] // 包含空角色，表示未登录用户也可访问
    }
  },
  {
    path: '/choose',
    name: 'choose',
    component: ChooseView,
    meta: {
      roles: ['student'],
      requiresAuth: true
    }
  },
  {
    path: '/thanks',
    name: 'thanks',
    component: ThanksView,
    meta: {
      roles: ['student', 'teacher']
    }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: {
      roles: ['teacher', 'student']
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      roles: ['teacher'],
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminView.vue'),
    meta: {
      roles: ['teacher'],
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'UserManagement',
        component: () => import('@/views/AdminUserManagement.vue'),
        meta: {
          roles: ['teacher'],
          requiresAuth: true
        }
      },
      {
        path: 'dates',
        name: 'DateManagement',
        component: () => import('@/views/AdminDateManagement.vue'),
        meta: {
          roles: ['teacher'],
          requiresAuth: true
        }
      },
      {
        path: 'societies',
        name: 'SocietyManagement',
        component: () => import('@/views/AdminSocietyManagement.vue'),
        meta: {
          roles: ['teacher'],
          requiresAuth: true
        }
      },
      {
        path: 'choice',
        name: 'ChoiceManagement',
        component: () => import('@/views/AdminChoiceManagement.vue'),
        meta: {
          roles: ['teacher'],
          requiresAuth: true
        }
      }
    ]
  },
];
