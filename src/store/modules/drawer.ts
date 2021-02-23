import store from '@/store';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { Platform } from 'quasar';

@Module({ dynamic: true, store, name: 'drawer', namespaced: true })
export class Drawer extends VuexModule {
  mini = false;
  expanded = true;
  isMobile = false;

  get drawerSettings(): { mini: boolean; expanded: boolean } {
    return this.isMobile
      ? {
          mini: false,
          expanded: this.expanded
        }
      : {
          mini: this.mini,
          expanded: true
        };
  }

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

  @Mutation
  SET_MOBILE(isMobile: boolean) {
    this.isMobile = isMobile;
  }

  @Action
  initialize() {
    this.SET_MOBILE(!Platform.is.desktop);

    if (this.isMobile) {
      this.MINIFY();
    }
  }

  @Action
  toggle() {
    this.expanded ? this.MINIFY() : this.EXPAND();
  }
}

export const DrawerModule = getModule(Drawer);
