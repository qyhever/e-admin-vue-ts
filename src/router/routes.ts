import { RouteRecordRaw } from 'vue-router'

import BasicLayout from '@/layouts/basic/index.vue'
// import BlankLayout from '@/layouts/blank/index.vue'
import NotFound from '@/views/exception/notfound.vue'

export const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
      affix: true
    }
  }
]

export const routes = [
  ...basicRoutes
]

export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/redirect',
    component: BasicLayout,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/',
    component: BasicLayout,
    children: basicRoutes
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound
  }
]
