import Vue from 'vue'

import './configure';

import Sweettooth from './Sweettooth.vue'

import router from './router';
import i18n from './i18n';

import server from './js/api/server';

import './registerServiceWorker';

// Initiate a request for the current user information.
try {
  server.hello().catch(err => {
    console.error(err);
  });
} catch (error) {
  console.error(error.message);
}

new Vue({
  router,
  i18n,
  render: h => h(Sweettooth)
}).$mount('#sweettooth');
