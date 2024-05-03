<template>
  <div
    ref="container"
    :class="[$style['container'], { [$style['container--open']]: isOpen }]"
    @click="handleOverlayClick($event)"
  >
    <button type="button" :class="$style['close-btn']" @click="closeMenu">
      <Icon name="window-close" :width="17" :height="17" />
    </button>
    <div :class="$style['search']">
      <div :class="$style['search__icon']">
        <Icon name="search" :width="15" :height="16" />
      </div>
      <input
        v-model="searchValue"
        name="search"
        placeholder="Search"
        :class="$style['search__input']"
      />
    </div>
    <div :class="$style['menu-list']">
      <button
        v-for="item in menuItems"
        v-show="
          item.windowName !== 'terms-window' &&
          item.windowName !== 'settings-window' &&
          item.windowName !== 'privacy-policy-window'
        "
        :ref="buttonsRefrences(item.windowName)"
        :key="item.windowName"
        type="button"
        :class="$style['menu-item']"
        @click="openWindow(item.windowName, item.index)"
      >
        <div :class="$style['menu-item__icon']">
          <Icon :name="item.icon.name" :width="item.icon.width" :height="item.icon.height" />
        </div>
        <div :class="$style['menu-item__label']">
          {{ item.label }}
        </div>
      </button>
    </div>
    <div :class="true ? $style['container__ad'] : $style['isLoading']">
      <div v-html="html"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref, watch } from 'vue';
import { debounce } from 'lodash';

import Icon from '~/components/shared/icon.vue';
import { AD_HTML_TAG } from '~/constants';
import { AdminModule } from '~/store/modules/admin';
import { MenuModule } from '~/store/modules/menu';
// import { AD_HTML_TAG } from '~/constants';
import { UserModule } from '~/store/modules/user';
import { WindowName, WindowsModule } from '~/store/modules/windows';
import { PermissionsTypes } from '~/types/models/admin-window-types';
import { areValuesEqual } from '~/utils/search';

interface MenuItem {
  icon: {
    name: string;
    width: number;
    height: number;
  };
  label: string;
  windowName: WindowName;
}

const menuItemsArray: MenuItem[] = [
  {
    label: 'Data collection',
    icon: {
      name: 'data-collection',
      width: 54,
      height: 45,
    },
    windowName: WindowName.DATA_COLLECTION,
  },
  {
    label: 'Analytics',
    icon: {
      name: 'analytics',
      width: 47,
      height: 47,
    },
    windowName: WindowName.ANALYTICS,
  },
  {
    label: 'Query history',
    icon: {
      name: 'query-history',
      width: 260,
      height: 260,
    },
    windowName: WindowName.QUERY_HISTORY,
  },
  {
    label: 'Events window',
    icon: {
      name: 'events-window',
      width: 120,
      height: 120,
    },
    windowName: WindowName.EVENTS_WINDOW,
  },
  {
    label: 'Admin window',
    icon: {
      name: 'admin',
      width: 57,
      height: 59,
    },
    windowName: WindowName.ADMIN_WINDOW,
  },
  {
    label: 'Terms window',
    icon: {
      name: 'terms',
      width: 57,
      height: 59,
    },
    windowName: WindowName.TERMS_WINDOW,
  },
  {
    label: 'Settings window',
    icon: {
      name: 'users-settings',
      width: 57,
      height: 59,
    },
    windowName: WindowName.USERS_SETTINGS,
  },
  {
    label: 'Privacy Policy window',
    icon: {
      name: 'users-settings',
      width: 57,
      height: 59,
    },
    windowName: WindowName.PRIVACY_WINDOW,
  },
];

// @Component({
//   name: 'Menu',
//   components: { Icon, Loader },
// })
export default defineComponent({
  name: 'DropdownMenu',
  components: { Icon },
  setup() {
    const searchValue: Ref<string> = ref('');
    const menuItems: Ref<MenuItem[]> = ref(menuItemsArray);
    const html: Ref<string> = ref('');
    const myBtn: Ref<HTMLElement | null> = ref(null);
    const settingsRef: Ref<HTMLElement | null> = ref(null);
    const privacyRef: Ref<HTMLElement | null> = ref(null);
    const isLoading: Ref<boolean> = ref(false);
    function buttonsRefrences(name: string) {
      if (name === 'terms-window') {
        return 'myBtn';
      } else if (name === 'settings-window') {
        return 'settingsRef';
      } else if (name === 'privacy-policy-window') {
        return 'privacyRef';
      } else {
        return undefined;
      }
    }

    const isOpen: ComputedRef<boolean> = computed(() => {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      isLoading.value = true;
      // eslint-disable-next-line vue/no-async-in-computed-properties
      setTimeout(() => (isLoading.value = false), 2000);
      return MenuModule.isOpen;
    });

    const permissions: ComputedRef<PermissionsTypes> = computed(() => {
      return AdminModule.permissions;
    });

    const displayTermsWindow: ComputedRef<boolean> = computed(() => {
      return UserModule.displayTerms;
    });
    const displayPrivacyWindow: ComputedRef<boolean> = computed(() => {
      return UserModule.displayPrivacy;
    });

    const displayUserSettings: ComputedRef<boolean> = computed(() => {
      return UserModule.displayUsersSettings;
    });

    onMounted(() => {
      html.value = AD_HTML_TAG;
      if (!permissions.value.Admin && !permissions.value.LisaPowerUsers) {
        menuItems.value = menuItems.value.filter(i => i.label !== 'Admin window');
      } else {
        menuItems.value = menuItems.value;
      }
    });

    function closeMenu(): void {
      searchValue.value = '';
      document.getElementById('test-id')?.remove();

      MenuModule.closeMenu();
    }

    function handleEscapePress(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeMenu();
      }
    }

    function openWindow(name: WindowName, index: number): void {
      closeMenu();
      WindowsModule.openWindow({ name, index });
    }

    function handleOverlayClick(e: Event): void {
      // if ($refs.container === e.target) {
      closeMenu();
      // }
    }

    watch(isOpen, (value: boolean) => {
      if (value) {
        document.body.addEventListener('keyup', handleEscapePress);
      } else {
        document.body.removeEventListener('keyup', handleEscapePress);
      }
    });

    watch(searchValue, () => {
      debounce(() => {
        menuItems.value = menuItemsArray.filter((item: any) =>
          areValuesEqual(item.label, searchValue.value),
        );
      }, 300);
    });
    // @Watch('searchValue')
    // @Debounce(300)
    // watchSearchValue(): void {
    //   this.menuItems = menuItems.filter((item: any) => areValuesEqual(item.label, this.searchValue));
    // }
    watch(displayTermsWindow, (value: boolean) => {
      if (value) {
        const button: any = myBtn.value;
        button[0].click();
      }
    });
    watch(displayPrivacyWindow, (value: boolean) => {
      if (value) {
        const button: any = privacyRef.value;
        console.log('buttp', button);
        button[0].click();
      }
    });

    watch(displayUserSettings, (value: boolean) => {
      if (value) {
        const button: any = settingsRef.value;
        button[0].click();
      }
    });
    return {
      handleOverlayClick,
      openWindow,
      handleEscapePress,
      closeMenu,
      displayUserSettings,
      displayTermsWindow,
      permissions,
      isOpen,
      isLoading,
      buttonsRefrences,
      searchValue,
      menuItems,
      html,
      myBtn,
      settingsRef,
      displayPrivacyWindow,
      privacyRef,
    };
  },
});
</script>

<style module lang="scss">
@mixin active-background {
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

$search-color: #d9dbe0;

.isLoading {
  display: none;
  border: orangered;
}
.container {
  background-color: rgba(26, 27, 32, 0.9);
  z-index: 999;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 100%;

  &--open {
    top: 0;
    bottom: 0;
  }

  &__ad {
    border: 1px dashed rgba(21, 44, 91, 0.42);
    border-radius: 10px;
    background-color: #e8eaed;
    font-weight: 500;
    font-size: 14px;
    color: rgba(21, 44, 91, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
}

.close-btn {
  @include active-background;

  cursor: pointer;
  border-radius: 5px;
  color: #fff;
  height: 55px;
  width: 55px;
  position: absolute;
  left: 45px;
  top: 35px;
}

.search {
  @include active-background;

  position: absolute;
  top: 35px;
  border-radius: 5px;
  width: 30%;
  height: 55px;

  &__icon {
    position: absolute;
    top: 50%;
    left: 18px;
    transform: translate3d(0, -50%, 0);
    color: $search-color;
  }

  &__input {
    width: 100%;
    height: 100%;
    padding: 0 18px 0 45px;
    color: $search-color;
    font-weight: 500;
    font-size: 16px;

    &::placeholder {
      color: $search-color;
    }
  }
}

.menu-list {
  display: grid;
  grid-template-columns: repeat(5, 145px);
  grid-template-rows: repeat(1, 168px);
  grid-gap: 10px;
}

.container--open .menu-list {
  animation: scaleIn 0.2s ease-in-out;

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(1.3);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
}

.ad-block {
  width: 100px;
  height: 100px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 5px;
  width: 145px;
  height: 168px;
  cursor: pointer;

  &:hover {
    @include active-background;
  }

  &__label {
    font-weight: 500;
    margin-top: 20px;
  }

  &__icon {
    width: 90px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
