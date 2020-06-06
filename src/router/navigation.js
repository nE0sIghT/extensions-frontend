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
      path: '/search/:query/:page?',
      name: 'Search extensions',
      component: () => import('../views/Search.vue'),
    },
])();
