import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import { ConnectionIndicator } from '~/services/api/connection-indecatore';
import { InfoGroupIAM } from '~/services/api/info-iam-get-group';
import { store } from '~/store';

import { ErrorsModule } from './errors';

@Module({
  dynamic: true,
  name: 'user',
  store,
})
class User extends VuexModule {
  isAdmin = false;
  isLisaPowerUsers = false;
  isLisaUsers = false;
  displayTerms = false;
  displayPrivacy = false;
  displayUsersSettings = false;
  pdfURL = '';
  useTurnServer: any = localStorage.getItem('useTurnServer') ?? true;
  globalNotificationsList: any = [];
  DisplayDropDownNotification = false;
  // useTurnServer: any =
  // localStorage.getItem('useTurnServer') !== null &&
  // localStorage.getItem('useTurnServer') !== undefined
  //   ? localStorage.getItem('useTurnServer')
  //   : true;
  userName = '';

  @Mutation
  private SET_USE_TURN_SERVER(value: any) {
    localStorage.setItem('useTurnServer', value);
    this.useTurnServer = value;
  }
  @Mutation
  private SET_GLOBAL_NOTIFICATIONS_LIST(value: any) {
    this.globalNotificationsList = value;
    console.log('mutation', this.globalNotificationsList);
  }
  @Mutation
  private SET_DISPLAY_DROPDOWN_NOTIFICATION(v: boolean) {
    this.DisplayDropDownNotification = v;
  }
  @Mutation
  private SET_IS_ADMIN(value: boolean) {
    this.isAdmin = value;
  }

  @Mutation
  private SET_IS_LISA_POWER_USERS(value: boolean) {
    this.isLisaPowerUsers = value;
  }

  @Mutation
  private SET_IS_LISA_USERS(value: boolean) {
    this.isLisaUsers = value;
  }

  @Mutation
  private SET_USER_NAME(value: string) {
    this.userName = value;
  }

  @Mutation
  private SET_DISPLAY_TERMS(value: boolean) {
    this.displayTerms = value;
  }
  @Mutation
  private SET_DISPLAY_PRIVACY(value: boolean) {
    this.displayPrivacy = value;
  }
  @Mutation
  private SET_DISPLAY_USERS_SETTINGS(value: boolean) {
    this.displayUsersSettings = value;
  }
  @Mutation
  private SET_PDF_URL(value: string) {
    this.pdfURL = value;
  }

  @Action
  public async infoGetGroupIAM() {
    try {
      const data = await InfoGroupIAM.getInformation();
      this.SET_IS_ADMIN(data.Admin);
      this.SET_IS_LISA_POWER_USERS(data.LisaPowerUsers);
      this.SET_IS_LISA_USERS(data.LisaUsers);
      this.SET_USER_NAME(data.UserName);
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    }
  }
  @Action
  public async turnServerValue(value: boolean) {
    this.SET_USE_TURN_SERVER(value);
  }
  @Action
  public async toggleDisplayTerms(value: boolean) {
    this.SET_DISPLAY_TERMS(value);
  }
  @Action
  public async toggleDisplayPrivacy(value: boolean) {
    this.SET_DISPLAY_PRIVACY(value);
  }
  @Action
  public async toggleDisplayUserSettings(value: boolean) {
    this.SET_DISPLAY_USERS_SETTINGS(value);
  }

  @Action
  public async setpdfUrl(value: string) {
    this.SET_PDF_URL(value);
  }

  @Action
  public async logOutGroupIAM() {
    try {
      await InfoGroupIAM.logOutUser();
      this.SET_IS_ADMIN(false);
      this.SET_IS_LISA_POWER_USERS(false);
      this.SET_IS_LISA_USERS(false);
      this.SET_USER_NAME('');
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    }
  }

  @Action
  public async getGlobalNotifications() {
    // this.SET_LIST_LOADER(true);
    try {
      const listFolder = await ConnectionIndicator.getGlobalNotifications();

      console.log(listFolder);
      await this.SET_GLOBAL_NOTIFICATIONS_LIST(listFolder);
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      // this.SET_LIST_LOADER(false);
    }
  }

  @Action
  public setDisplayDropdownNotification(v: boolean) {
    this.SET_DISPLAY_DROPDOWN_NOTIFICATION(v);
  }
}

export const UserModule = getModule(User);
