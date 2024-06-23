import { createRouter, createWebHistory } from 'vue-router'
import TheLayout from '@/components/layout/TheLayout.vue'
import store from '../store'

//Login

import LoginView from '../views/auth/LoginView.vue'


const routes= [
    {
      path: '/',
      name: 'layout',
      component: TheLayout,
      children: [
        { path: '', name: 'fallback', redirect: () => { return { name: 'dashboard' } } },
        {
          path: 'dashboard',

          children: [
            {
              path: '',
              name: 'dashboard',
              component: () => import('../views/dashboard/DashboardView.vue'),
            },
          ]
        },
        {
          path: 'oses',

          children: [
            {
              path: '',
              name: 'oses',
              component: () => import('../views/oses/OSView.vue'),
            },
            {
              path: 'create',
              name: 'createOS',
              component: () => import('../views/oses/CreateOS.vue'),
            },
          ]
        },
        {
          path: 'rootFiles',

          children: [
            {
              path: '',
              name: 'rootFiles',
              component: () => import('../views/rootFiles/RootFiles.vue'),
            },
            {
              path: 'create',
              name: 'createRootFile',
              component: () => import('../views/rootFiles/CreateRootFile.vue'),
            },
          ]
        },
        {
          path: 'isoFiles',

          children: [
            {
              path: '',
              name: 'isoFiles',
              component: () => import('../views/isoFiles/ISOView.vue'),
            },
            {
              path: 'create',
              name: 'createISOFile',
              component: () => import('../views/isoFiles/CreateISO.vue'),
            },
          ]
        },
        {
          path: 'vms',

          children: [
            {
              path: '',
              name: 'vms',
              component: () => import('../views/vms/VMSView.vue'),
            },
            {
              path: 'create',
              name: 'createVM',
              component: () => import('../views/vms/CreateVM.vue'),
            },
          ]
        },
      ],
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    }

  ]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user?.access)
      return { name: 'login' }
    else {
      if (to.matched.some(record => record.meta.requiresAdmin) && !store.userService('Admin'))
        return { name: 'dashboard' }
    }
  } else {
    if (store.state.user?.access) {
      return { name: 'dashboard' }
    }
  }

})

export default router
