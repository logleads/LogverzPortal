<template>
  <div :class="$style['block']" @click="changeDropDown">
    <div :class="$style['user-block']">
      <img
        :src="require('~/assets/images/user-icon.svg')"
        :class="$style['user-icon']"
        alt="user-icon"
      />
      <span :class="$style['user-block_text']">{{ userName || 'userName' }}</span>
      <img :src="require('~/assets/images/vector.svg')" alt="user-vector" />
    </div>
    <div v-if="isOpen" :class="$style['user-dropdown']">
      <div :class="$style['user-dropdown-item']" @click="usersSettings">
        <img
          :src="require('~/assets/images/user_small.svg')"
          alt="user-icon"
          width="25"
          height="25"
        /><span :class="$style['user-dropdown-item_text']"> User profile settings </span>
      </div>
      <div :class="$style['user-dropdown-item']" @click="termsandconditions">
        <img
          :src="require('~/assets/images/files.svg')"
          alt="user-icon"
          width="25"
          height="25"
        /><span :class="$style['user-dropdown-item_text']"> Terms and conditions </span>
      </div>
      <div :class="$style['user-dropdown-item']" @click="privacyPolicy">
        <img
          :src="require('~/assets/images/files.svg')"
          alt="user-icon"
          width="25"
          height="25"
        /><span :class="$style['user-dropdown-item_text']"> Privacy Policy </span>
      </div>
      <div :class="$style['user-dropdown-item']" @click="logOut">
        <img
          :src="require('~/assets/images/exit.svg')"
          alt="user-icon"
          width="25"
          height="25"
        /><span :class="$style['user-dropdown-item_text']"> Log out </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, Ref, ref } from 'vue';

import { AdminModule } from '~/store/modules/admin';
import { UserModule } from '~/store/modules/user';

export default defineComponent({
  name: 'UserBlock',
  components: {},
  setup() {
    const isOpen: Ref<boolean> = ref(false);
    const windowNames: Ref<string> = ref('terms and conditions');

    const userName: ComputedRef<string> = computed(() => {
      return AdminModule.permissions.UserName;
    });
    // const displayTermsWindow: ComputedRef<boolean> = computed(() => {
    //   return UserModule.displayTerms;
    // });
    const displayPrivacyPolicy: ComputedRef<boolean> = computed(() => {
      return UserModule.displayPrivacy;
    });
    const displayUsersSettings: ComputedRef<boolean> = computed(() => {
      return UserModule.displayUsersSettings;
    });

    const displayTermsWindow = computed({
      get: () => UserModule.displayTerms,
      set: (value: boolean) => {
        UserModule.toggleDisplayTerms(value);
      },
    });

    function changeDropDown(): void {
      isOpen.value = !isOpen.value;
    }

    function logOut(): void {
      UserModule.logOutGroupIAM();
      isOpen.value = false;
    }

    function termsandconditions(): void {
      UserModule.setpdfUrl(
        'https://docs.logverz.io/assets/docs/Logverz_Software_Public_Licence_Agreement.pdf',
      );
      if (!displayTermsWindow.value) {
        // UserModule.toggleDisplayPrivacy(false);
        displayTermsWindow.value = true;
        UserModule.toggleDisplayTerms(displayTermsWindow.value);
        isOpen.value = false;
      }
    }
    function privacyPolicy(): void {
      UserModule.setpdfUrl('https://docs.logverz.io/assets/docs/LogLeads_Privacy_Policy.pdf');
      if (!displayTermsWindow.value) {
        // UserModule.toggleDisplayTerms(!displayTermsWindow.value);
        displayTermsWindow.value = true;
        UserModule.toggleDisplayTerms(displayTermsWindow.value);
        isOpen.value = false;
        isOpen.value = false;
      }
    }
    function usersSettings(): void {
      UserModule.toggleDisplayUserSettings(!displayUsersSettings.value);
      isOpen.value = false;
    }
    return {
      usersSettings,
      termsandconditions,
      privacyPolicy,
      logOut,
      changeDropDown,
      displayPrivacyPolicy,
      displayUsersSettings,
      displayTermsWindow,
      userName,
      isOpen,
      windowNames,
    };
  },
});
</script>

<style module lang="scss">
.block {
  position: relative;
}

.user-block {
  background-color: rgba(163, 169, 202, 0.15);
  height: 42px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  border-radius: 4px;

  &_text {
    margin: 5px;
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 319.69%;
    color: #ffffff;
    border-radius: 4px;
  }
}

.user-dropdown {
  position: absolute;
  z-index: 100;
  top: 40px;
  right: 0;
  background-color: #fff;
  box-shadow: 0 4px 24px rgb(0 0 0 / 5%);
  border: 1px solid rgba(181, 190, 203, 0.28);
  border-radius: 10px;
}

.user-dropdown-item {
  margin: 10px 5px 10px 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;

  &_text {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 11px;
    color: #1a1b20;
    margin: 5px;
  }
}

.user-icon {
  width: 30px;
}
</style>
