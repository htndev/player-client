import Vue from 'vue';

import './plugins/axios';
import './plugins/quasar';
import './registerServiceWorker';
import '@/assets/styles/main.less';

import { createProvider } from './plugins/apollo';
import router from './router';
import store from './store';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app');
