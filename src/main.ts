import '@/assets/styles/main.less';
import '@/plugins/axios';
import '@/plugins/quasar';
import '@/registerServiceWorker';

import { createProvider } from '@/plugins/apollo';
import i18n from '@/plugins/i18n';
import router from '@/router';
import store from '@/store';
import Vue from 'vue';

import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app');
