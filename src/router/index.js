import { createRouter, createWebHistory } from 'vue-router'
import TheLayout from '@/components/layout/TheLayout.vue'
import store from '../store'

//Login

import LoginView from '../views/auth/LoginView.vue'

//Dasboard
import DashboardView from '../views/dashboard/DashboardView.vue'


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
              component: DashboardView,
            },
          ]
        },
      ],
      meta: { requiresAuth: false },
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
