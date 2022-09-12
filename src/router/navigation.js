export default (() => [
    {
      path: '/',
      name: 'Extensions',
      component: () => import('../views/Extensions.vue'),
      showInMenu: true,
    },
    {
      path: '/local',
      name: 'Installed',
      component: () => import('../views/Installed.vue'),
      showInMenu: true,
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
    },
    {
      path: '/verify-user',
      name: 'Verify user',
      component: () => import('../views/VerifyUser.vue'),
    },
    {
      path: '/reset-password',
      name: 'Reset password',
      component: () => import('../views/ResetPassword.vue'),
    },
    {
      path: '/search/:query?/:page?',
      name: 'Search extensions',
      component: () => import('../views/Search.vue'),
    },
    {
      path: '/extension/:uuid',
      name: 'Extension',
      component: () => import('../views/Extension.vue'),
    },
])();
