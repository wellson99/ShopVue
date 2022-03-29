import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
// import AboutView from '../views/AboutView.vue'
// import productsView from '../views/productsView.vue'
// import productDetailView from '../views/productDetails.vue'
// import cartView from '../views/cartView.vue'
// import purchaseView from '../views/purchaseView.vue'
// import profileView from '../views/profileView.vue'
// import reviewView from '../views/reviewView.vue'
import {userState} from "../../firebase/firebaseConfig"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    // component: HomeView,
    component: () => import(/* webpackChunkName: "auth" */ '../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/signup',
    name: 'sl',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    // component: AboutView,
    component: () => import(/* webpackChunkName: "auth" */ '../views/AboutView.vue'),
    meta: { requiresUnauth: true }
  },
  {
    path: '/products',
    name: 'products',
    // component: productsView,
    component: () => import(/* webpackChunkName: "products" */ '../views/productsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/product/:productID',
    name: 'productDetails',
    // component: productDetailView,
    component: () => import(/* webpackChunkName: "productDetails" */ '../views/productDetails.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/cart',
    name: 'cart',
    // component: cartView,
    component: () => import(/* webpackChunkName: "cart" */ '../views/cartView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/purchase',
    name: 'purchase',
    // component: purchaseView,
    component: () => import(/* webpackChunkName: "purchase" */ '../views/purchaseView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    // component: profileView,
    component: () => import(/* webpackChunkName: "purchase" */ '../views/profileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/review',
    name: 'review',
    // component: reviewView,
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
