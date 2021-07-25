import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/registration',
    name: 'Registration',
    component: () => import('../views/Registration.vue')
  },
  {
    path: '/connection',
    name: 'Connection',
    component: () => import('../views/Connection.vue')
  },
  {
    path: '/publications',
    name: 'Publications',
    component: () => import('../views/Publications.vue')
  },
  {
    path: '/publication/:id',
    name: 'Publication',
    component: () => import('../views/Publication.vue')
  },
  {
    path: '/profil/:id',
    name: 'Profil',
    component: () => import('../views/Profil.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../components/PageNotFound.vue')
  },
  {
    path: '*',
    redirect: '404'
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/registration', '/connection', '/', '/about'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    next('/connection');
  } else {
    next();
  }
});

export default router
