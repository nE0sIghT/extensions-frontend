import Vue from 'vue';

import VueCompositionAPI from '@vue/composition-api';
import VueMoment from 'vue-moment';

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';

Vue.config.productionTip = false;

Vue.use(VueCompositionAPI);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueMoment);