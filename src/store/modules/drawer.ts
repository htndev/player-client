import store from '@/store';
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ dynamic: true, store, name: 'drawer', namespaced: true })
export class Drawer extends VuexModule {
  mini = false;
  expanded = true;

  @Mutation
  MINIFY() {
    this.mini = true;
    this.expanded = false;
  }

  @Mutation
  EXPAND() {
    this.mini = false;
    this.expanded = true;
  }
}

export const DrawerModule = getModule(Drawer);
