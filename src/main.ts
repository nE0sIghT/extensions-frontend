import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import { extend } from 'vee-validate';
import { confirmed, email, max, min, required } from 'vee-validate/dist/rules';

import VueMoment from 'vue-moment'
import SweettoothComponent from './Sweettooth.vue'
import './registerServiceWorker'
import router from './router'
import i18n from './i18n'

import SweetToothPlugin from './plugins/sweettooth'


Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueMoment);
Vue.use(SweetToothPlugin);

for (const rule of [{confirmed}, {min}, {max}, {required}, {email}]) {
    extend(Object.keys(rule)[0], Object.values(rule)[0]);
}

new Vue({
  router,
  i18n,
  render: h => h(SweettoothComponent)
}).$mount('#sweettooth')
