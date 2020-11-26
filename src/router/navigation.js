import server from '../js/api/server';

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
    path: '/comments/posted/',
    /**
     * 
     * @param {import('vue-router').Route} to 
     * @param {import('vue-router').Route} _from 
     * @param {import('vue-router').NavigationGuardNext} next 
     */
    beforeEnter: (to, _from, next) => {
      const commentId = to.query.c;
console.log(_from)
      if (typeof commentId === 'string') {
        server.comment(commentId).then((comment) => {
          next(`/extension/${comment.data.object_pk}`)
        }).catch(error => {
          console.error(error.message);
          next(`/`);
        })
      } else {
        next(`/`);
      }
    }
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
