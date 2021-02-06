import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from '@/store';

@Module({ dynamic: true, store, name: 'user', namespaced: true })
export class User extends VuexModule {
  user = null;

  @Mutation
  SET_USER(user: any) {
    this.user = user;
  }

  @Action
  getUser() {
    this.SET_USER({});
  }
}

export const UserModule = getModule(User);
