import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import { store } from '~/store';

@Module({
  dynamic: true,
  name: 'errors-module',
  store,
})
class Errors extends VuexModule {
  errorText = '';
  warningText = '';

  @Mutation
  private SET_ERROR_TEXT(value: string) {
    this.errorText = value;
  }

  @Mutation
  private SET_WARNING_TEXT(value: string) {
    this.errorText = value;
  }

  @Action
  public showErrorMessage(message: string) {
    this.SET_ERROR_TEXT(message);
  }

  @Action
  public showWarningMessage(message: string) {
    // eslint-disable-next-line no-console
    console.log('31 error module', message);
    this.SET_WARNING_TEXT(message);
  }
}

export const ErrorsModule = getModule(Errors);
