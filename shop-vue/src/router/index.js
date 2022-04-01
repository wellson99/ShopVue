import Vue from 'vue'
import VueRouter from 'vue-router'
import {userState} from "../../firebase/firebaseConfig"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "auth" */ '../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/signup',
    name: 'sl',
    component: () => import(/* webpackChunkName: "auth" */ '../views/authView.vue'),
    meta: { requiresUnauth: true }
  },
  {
    path: '/products',
    name: 'products',
    component: () => import(/* webpackChunkName: "products" */ '../views/productsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/product/:productID',
    name: 'productDetails',
    component: () => import(/* webpackChunkName: "productDetails" */ '../views/productDetails.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import(/* webpackChunkName: "cart" */ '../views/cartView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/purchase',
    name: 'purchase',
    component: () => import(/* webpackChunkName: "purchase" */ '../views/purchaseView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "purchase" */ '../views/profileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/purchase/:purcID/review/:prodID/:index',
    name: 'review',
    component: () => import(/* webpackChunkName: "purchase" */ '../views/reviewView.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(){
    return { x: 0, y: 0 };
  },
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresUnauth = to.matched.some(record => record.meta.requiresUnauth)

  const isAuth = await userState()
  // const isAuth = this.$store.getters["uState/getUserState"]

  if (requiresAuth && !isAuth) next('/signup')
  else if (requiresUnauth && isAuth) next('/')
  else next()
})

export default router
