export default (() => [
  {
    path: '/',
    name: 'Extensions',
    component: () => import('../views/Extensions.vue'),
    showInMenu: true,
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
    component: () => import('../views/Settings.vue')
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
