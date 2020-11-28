import Vue from 'vue'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api';
import VueMoment from 'vue-moment'

import Sweettooth from './Sweettooth.vue'

import router from './router'
import i18n from './i18n'

import './registerServiceWorker'

Vue.config.productionTip = false;

Vue.use(VueCompositionAPI);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueMoment);

new Vue({
  router,
  i18n,
  render: h => h(Sweettooth)
}).$mount('#sweettooth');
