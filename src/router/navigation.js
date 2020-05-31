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
      path: '/search',
      name: 'Search extensions',
      component: () => import('../views/About.vue'),
      props: (route) => ({ query: route.query.query })
    }
])();
