<template>
  <div :class="$style['header']">
    <div :class="$style['header']">
      <MenuButton />
      <WindowTabs />
    </div>
    <div :class="$style['header']">
      <ConnectionsIndecator />
      <UserBlock />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import ConnectionsIndecator from '~/components/analytics-window/connections-indecator.vue';
import MenuButton from '~/components/menu/menu-button.vue';
import Icon from '~/components/shared/icon.vue';
import UserBlock from '~/components/user-icon/user-block.vue';
import WindowTabs from '~/components/window-tabs/tabs.vue';
@Component({
  name: 'Header',
  components: { Icon, MenuButton, WindowTabs, UserBlock, ConnectionsIndecator },
})
export default class Header extends Vue {}
</script>

<style module lang="scss">
.header {
  height: 46px;
  background-color: var(--header-color);
  display: flex;
  align-items: center;
  padding: 0 1px;
  display: flex;
  justify-content: space-between;
}
</style>
