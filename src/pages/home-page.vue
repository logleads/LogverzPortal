<template>
  <div :class="$style['container']">
    <Header />
    <div :class="$style['workspace']">
      <Window v-for="(window, index) in activeWindows" :key="index" :index="index" :window="window">
        <component
          :is="windowComponents[window.name]"
          v-bind="{ curentKey: window.index, dataNumber: window.dataNumber }"
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
import {
  computed,
  ComputedRef,
  defineComponent,
  onMounted,
  Ref,
  ref,
  watch,
} from '@vue/composition-api';

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
// import { UserModule } from '~/store/modules/user';
import { WindowData, WindowName, WindowsModule } from '~/store/modules/windows';

const windowComponentsArr = {
  [WindowName.ANALYTICS]: QueryBuilderWindow,
  [WindowName.DATA_COLLECTION]: DataCollectionWindow,
  [WindowName.ADMIN_WINDOW]: AdminWindow,
  [WindowName.QUERY_HISTORY]: QueryHistory,
  [WindowName.EVENTS_WINDOW]: EventsWindow,
  [WindowName.TERMS_WINDOW]: TermsWindow,
  [WindowName.USERS_SETTINGS]: UserSettings,
  [WindowName.PRIVACY_WINDOW]: PrivacyPolicy,
};

export default defineComponent({
  name: 'HomePage',
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { ErrorMessage, Window, Button, Header, Menu },
  setup() {
    const termsWindow: Ref<WindowData> = ref({
      minimized: false,
      label: 'Terms Window',
      name: 'TermsWindow' as WindowName,
      zIndex: 55,
      index: 0,
      windowName: 'terms window',
      dataNumber: Math.floor(Math.random() * 1000),
    });
    const userSettingsWindow: Ref<WindowData> = ref({
      minimized: false,
      label: 'user Settings Window',
      name: 'settingsWindow' as WindowName,
      zIndex: 55,
      index: 0,
      windowName: 'user settings window',
      dataNumber: Math.floor(Math.random() * 1000),
    });
    const activeWindowsLocal: Ref<any> = ref([]);
    const showTermsWindow: Ref<boolean> = ref(false);
    const showSettingsWindow: Ref<boolean> = ref(false);
    const activeWindows: ComputedRef<WindowData[]> = computed(() => {
      return Object.values(WindowsModule.activeWindows).filter((window): window is WindowData => {
        return Boolean(window && !window.minimized);
      });
    });
    watch(activeWindows, () => {
      // console.log('home-page', toRefs(activeWindows));
      console.log(1);
      activeWindowsLocal.value = activeWindows.value;
    });
    // get customKey(){
    //   return
    // }
    // @Watch('displayTermsWindow')
    //   handleInitUsers(value: boolean): void {
    //     this.showTermsWindow = value;
    //   }
    const windowComponents: ComputedRef<typeof windowComponentsArr> = computed(() => {
      return windowComponentsArr;
    });

    const errorMessage: ComputedRef<string> = computed(() => {
      return ErrorsModule.errorText;
    });

    const isReceivedPermissions: ComputedRef<boolean> = computed(() => {
      return AdminModule.isReceivedPermissions;
    });

    // get displayTermsWindow(): boolean {
    //   return UserModule.displayTerms;
    // }

    onMounted(() => {
      AdminModule.checkIfAdmin();
    });

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
    return {
      isReceivedPermissions,
      termsWindow,
      userSettingsWindow,
      showTermsWindow,
      showSettingsWindow,
      activeWindows,
      windowComponents,
      errorMessage,
      activeWindowsLocal,
    };
  },
});
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
