<template>
  <div :class="$style['container']">
    <Header />
    <div :class="$style['workspace']">
      <Window v-for="(window, index) in activeWindows" :key="index" :window="window">
        <component
          :is="windowComponents[window.name]"
          v-bind="{ curentKey: window.index }"
          :key="index"
          >{{ index }}</component
        >
      </Window>
      <Window v-if="showTermsWindow" :window="termsWindow">
        <component :is="true">{{ 1 }} </component>
      </Window>
      <Window v-if="showSettingsWindow" :window="userSettingsWindow">
        <component :is="true">{{ 1 }} </component>
      </Window>
    </div>
    <Menu v-if="isReceivedPermissions" />
    <notifications group="foo" />
  </div>
</template>

<script lang="ts">
import { VueConstructor } from 'vue';
import { Component, Vue } from 'vue-property-decorator';

import AdminWindow from '~/components/admin-window/admin-window.vue';
import DataCollectionWindow from '~/components/create-query/data-collection-window.vue';
import EventsWindow from '~/components/events-window/events-window.vue';
import Menu from '~/components/menu/menu.vue';
import PrivacyPolicy from '~/components/privacy-policy/privacypolicy.vue';
import QueryBuilderWindow from '~/components/query-builder/query-builder-window.vue';
import QueryHistory from '~/components/query-history/query-history.vue';
import Button from '~/components/shared/button.vue';
import ErrorMessage from '~/components/shared/ErrorMessage.vue';
import Header from '~/components/shared/header.vue';
import TermsWindow from '~/components/termsandconditions/terms.vue';
import UserSettings from '~/components/user-settings/user-settings.vue';
import Window from '~/components/window.vue';
import { AdminModule } from '~/store/modules/admin';
import { ErrorsModule } from '~/store/modules/errors';
// import { UserModule } from '~/store/modules/user';
import { WindowData, WindowName, WindowsModule } from '~/store/modules/windows';

const windowComponents: Record<WindowName, VueConstructor> = {
  [WindowName.ANALYTICS]: QueryBuilderWindow,
  [WindowName.DATA_COLLECTION]: DataCollectionWindow,
  [WindowName.ADMIN_WINDOW]: AdminWindow,
  [WindowName.QUERY_HISTORY]: QueryHistory,
  [WindowName.EVENTS_WINDOW]: EventsWindow,
  [WindowName.TERMS_WINDOW]: TermsWindow,
  [WindowName.USERS_SETTINGS]: UserSettings,
  [WindowName.PRIVACY_WINDOW]: PrivacyPolicy,
};

@Component({
  name: 'HomePage',
  components: { ErrorMessage, Window, Button, Header, Menu },
})
export default class HomePage extends Vue {
  public termsWindow: WindowData = {
    minimized: false,
    label: 'Terms Window',
    name: 'TermsWindow' as WindowName,
    zIndex: 55,
    index: 0,
    windowName: 'terms window',
  };
  public userSettingsWindow: WindowData = {
    minimized: false,
    label: 'user Settings Window',
    name: 'settingsWindow' as WindowName,
    zIndex: 55,
    index: 0,
    windowName: 'user settings window',
  };
  public showTermsWindow: boolean = false;
  public showSettingsWindow: boolean = false;
  get activeWindows(): WindowData[] {
    return Object.values(WindowsModule.activeWindows).filter((window): window is WindowData => {
      return Boolean(window && !window.minimized);
    });
  }

  // get customKey(){
  //   return
  // }
  // @Watch('displayTermsWindow')
  //   handleInitUsers(value: boolean): void {
  //     this.showTermsWindow = value;
  //   }
  get windowComponents(): typeof windowComponents {
    return windowComponents;
  }

  get errorMessage(): string {
    return ErrorsModule.errorText;
  }

  get isReceivedPermissions(): boolean {
    return AdminModule.isReceivedPermissions;
  }

  // get displayTermsWindow(): boolean {
  //   return UserModule.displayTerms;
  // }

  mounted(): void {
    AdminModule.checkIfAdmin();
  }

  // @Watch('errorMessage')
  // handleError(value: string): void {
  //   this.$notify({
  //     // (optional)
  //     // Name of the notification holder
  //     group: 'foo',

  //     // (optional)
  //     // Class that will be assigned to the notification
  //     type: 'error',

  //     // (optional)
  //     // Title (will be wrapped in div.notification-title)
  //     title: 'Error',

  //     // Content (will be wrapped in div.notification-content)
  //     text: `<b> ${value} </b>`,

  //     // (optional)
  //     // Overrides default/provided duration
  //     duration: 10000,

  //     // (optional)
  //     // Overrides default/provided animation speed
  //     speed: 4000,

  //     // (optional)
  //     // Data object that can be used in your template
  //     data: {},
  //   });
  // }
}
</script>

<style module lang="scss">
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.workspace {
  flex: 1;
  position: relative;
}
</style>
