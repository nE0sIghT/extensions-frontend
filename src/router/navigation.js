import server from '../js/api/server';

const user = server.getUser();

/**
 * @param {import('vue-router').Route} _to 
 * @param {import('vue-router').Route} _from 
 * @param {import('vue-router').NavigationGuardNext} next 
 */
function redirectToHome(_to, _from, next) {
  if (user.value) {
    next('/');
  } else {
    next();
  }
}

/**
 * @param {import('vue-router').Route} to 
 * @param {import('vue-router').Route} _from 
 * @param {import('vue-router').NavigationGuardNext} next 
 */
function redirectToLogin(to, _from, next) {
  if (!user.value) {
    next({
      path: '/login',
      query: {
        from: to.path ? encodeURIComponent(to.path) : ''
      }
    });
  } else {
    next();
  }
}

/** @type {import('vue-router').RouteConfig[]} */
const routes = [
  {
    path: '/',
    name: 'Extensions',
    component: () => import('../views/Extensions.vue')
  },
  {
    // TODO: Add redirect from /extension/:id/:slug -> /extension/:id
    path: '/extension/:id',
    name: 'Extension',
    component: () => import('../views/Extension.vue')
  },
  {
    // TODO: Add redirect from /accounts/profile/:username -> /profile/:id
    path: '/profile/:id',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/settings',
    name: 'User Settings',
    component: () => import('../views/Settings.vue'),
    beforeEnter: redirectToLogin
  },
  {
    path: '/local',
    name: 'Installed',
    component: () => import('../views/Installed.vue')
  },
  {
    path: '/search/:query?/:page?',
    name: 'Search extensions',
    component: () => import('../views/Search.vue'),
  },
  {
    path: '/register/',
    name: 'Register New Account',
    component: () => import('../views/Register.vue'),
    beforeEnter: redirectToHome
  },
  {
    path: '/login/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    beforeEnter: redirectToHome
  },
  {
    path: '/verify-email/',
    name: 'Verify Email',
    component: () => import('../views/VerifyEmail.vue')
  },
  {
    path: '/verify-user/',
    name: 'Verify Registration',
    component: () => import('../views/VerifyRegistration.vue')
  },
];

export default routes;
