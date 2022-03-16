import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresUnauth = to.matched.some(record => record.meta.requiresUnauth)

  const isAuth = await userState()

  if (requiresAuth && !isAuth) next('/signup')
  else if (requiresUnauth && isAuth) next('/')
  else next()
})

export default router
