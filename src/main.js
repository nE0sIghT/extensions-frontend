import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import VueMoment from 'vue-moment'
import Sweettooth from './Sweettooth.vue'
import './registerServiceWorker'
import router from './router'
import i18n from './i18n'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueMoment);

new Vue({
  router,
  i18n,
  render: h => h(Sweettooth)
}).$mount('#sweettooth')
