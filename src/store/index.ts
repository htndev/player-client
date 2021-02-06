import { User } from '@/store/modules/user';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

interface RootState {
  user: User;
}

export default new Vuex.Store<RootState>({
  strict: true,
  modules: {}
});
