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
import { defineComponent } from '@vue/composition-api';

import ConnectionsIndecator from '~/components/analytics-window/connections-indecator.vue';
import MenuButton from '~/components/menu/menu-button.vue';
import UserBlock from '~/components/user-icon/user-block.vue';
import WindowTabs from '~/components/window-tabs/tabs.vue';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
  name: 'Header',
  components: { MenuButton, WindowTabs, UserBlock, ConnectionsIndecator },
});
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
