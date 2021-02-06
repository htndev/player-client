import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import './plugins/axios';
import './plugins/quasar';
import router from './router';
import store from './store';
import '@/assets/styles/main.less';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
