import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import { store } from '~/store';

@Module({ dynamic: true, name: 'menu', store })
class Menu extends VuexModule {
  isOpen: boolean = false;

  @Mutation
  private OPEN_MENU() {
    this.isOpen = true;
  }

  @Mutation
  private CLOSE_MENU() {
    this.isOpen = false;
  }

  @Action
  public openMenu() {
    this.OPEN_MENU();
  }

  @Action
  public closeMenu() {
    this.CLOSE_MENU();
  }
}

export const MenuModule = getModule(Menu);
