export default (() => [
  {
    path: '/',
    name: 'Extensions',
    component: () => import('../views/Extensions.vue'),
    showInMenu: true,
  },
  {
    path: '/extension/:id',
    name: 'Extension',
    component: () => import('../views/Extension.vue')
  },
  {
    path: '/accounts/profile/:id',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/local',
    name: 'Installed',
    component: () => import('../views/Installed.vue'),
    showInMenu: true,
  },
  {
    path: '/search/:query?/:page?',
    name: 'Search extensions',
    component: () => import('../views/Search.vue'),
  },
])();
