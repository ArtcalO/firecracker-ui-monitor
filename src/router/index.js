import { createRouter, createWebHistory } from 'vue-router'
import TheLayout from '@/components/layout/TheLayout.vue'
import store from '../store'

//Login

import LoginView from '../views/auth/LoginView.vue'

//Dasboard
import DashboardView from '../views/dashboard/DashboardView.vue'

//Users

import UsersView from "../views/users/UsersView.vue"
import CreateUser from "../views/users/CreateUser.vue"

//Products

import ProductsView from "../views/products/ProductsView.vue"
import CreateProduct from "../views/products/CreateProduct.vue"
import SupplyProduct from "../views/products/SupplyProduct.vue"
import ListSupplyProduct from "../views/products/ListSupplyProduct.vue"

//Stock

import MainStock from "../views/stocks/MainStock.vue"
import TransferedStock from "../views/stocks/TransferedStock.vue"
import ShopStock from "../views/stocks/ShopStock.vue"
import SalesView from "../views/stocks/SalesView.vue"
import HistPayDebt from "../views/stocks/HistPayDebt.vue"

//outlays

import OutlaysView from "../views/depenses/OutlaysView.vue"
import CreateOutlay from "../views/depenses/CreateOutlay.vue"

//loss

import CreateLossShop from "../views/loss/lossShop/CreateLossShop.vue"
import LossShop from "../views/loss/lossShop/LossShop.vue"
import LossMainStock from "../views/loss/lossMainStock/LossMainStock.vue"
import CreateLossMainStock from "../views/loss/lossMainStock/CreateLossMainStock.vue"

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
        {
          path: 'users',

          children: [
            {
              path: '',
              name: 'users',
              component: UsersView,
            },
            {
              path: 'create',
              name: 'createUser',
              component: CreateUser,
            },
            {
              path: 'update/:id',
              name: 'updateUser',
              component: CreateUser,
            },
          ]
        },
        {
          path: 'stocks',

          children: [
            {
              path: 'main-stock',
              name: 'mainStock',
              component: MainStock,
            },
            {
              path: 'tr-stock',
              name: 'transferedStock',
              component: TransferedStock,
            },
            {
              path: 'shop-stock',
              name: 'shopStock',
              component: ShopStock,
            },
            {
              path: 'sales',
              name: 'sales',
              component: SalesView,
            },
            {
              path: 'hist-pay-debt/:id',
              name: 'histPayDebt',
              component: HistPayDebt,
            },
          ]
        },
        {
          path: 'outlays',

          children: [
            {
              path: '',
              name: 'outLays',
              component: OutlaysView,
            },
            {
              path: 'create',
              name: 'createOutlay',
              component: CreateOutlay,
            },
          ]
        },
        {
          path: 'loss',

          children: [
            {
              path: 'loss-shop',
              name: 'lossShop',
              component: LossShop,
            },
            {
              path: 'loss-main-stock',
              name: 'lossMainStock',
              component: LossMainStock,
            },
            {
              path: 'create-loss-shop',
              name: 'createLossShop',
              component: CreateLossShop,
            },
            {
              path: 'create-loss-main-stock',
              name: 'createLossMainStock',
              component: CreateLossMainStock,
            },
          ]
        },
        {
          path: 'products',
          children: [
            {
              path: '',
              name: 'products',
              component: ProductsView,
            },
            {
              path: 'create',
              name: 'createProduct',
              component: CreateProduct,
            },
            {
              path: 'supply/:id',
              name: 'supplyProduct',
              component: SupplyProduct,
            },
            {
              path: 'list-supply-product/:id',
              name: 'listSupplyProduct',
              component: ListSupplyProduct,
            },
            {
              path: 'update/:id',
              name: 'updateProduct',
              component: CreateProduct,
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
