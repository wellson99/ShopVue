import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import productsView from '../views/productsView.vue'
import productDetailView from '../views/productDetails.vue'
import cartView from '../views/cartView.vue'
import purchaseView from '../views/purchaseView.vue'
import profileView from '../views/profileView.vue'
import reviewView from '../views/reviewView.vue'
import {userState} from "../../firebase/firebaseConfig"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/signup',
    name: 'sl',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    component: AboutView,
    meta: { requiresUnauth: true }
  },
  {
    path: '/products',
    name: 'products',
    component: productsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/productDetails',
    name: 'productDetails',
    component: productDetailView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/cart',
    name: 'cart',
    component: cartView,
    meta: { requiresAuth: true }
  },
  {
    path: '/purchase',
    name: 'purchase',
    component: purchaseView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: profileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/review',
    name: 'review',
    component: reviewView,
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
