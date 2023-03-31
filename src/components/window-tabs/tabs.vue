<template>
  <Draggable
    v-model="items"
    :class="$style['tabs']"
    @start="dragging = true"
    @end="dragging = false"
  >
    <TabItem
      v-for="(window, index) in items"
      :key="index"
      :index="index"
      :key-c="window.index"
      :item="window"
      :dragging="dragging"
    >
      {{ window.name }}
    </TabItem>
  </Draggable>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import Draggable from 'vuedraggable';

import { WindowData, WindowsModule } from '~/store/modules/windows';

import TabItem from './tab-item.vue';

@Component({
  name: 'Header',
  components: { Draggable, TabItem },
})
export default class Tabs extends Vue {
  items: WindowData[] = [];
  dragging: boolean = false;

  get activeWindows(): Array<WindowData> {
    return WindowsModule.activeWindows;
  }

  @Watch('activeWindows')
  watchActiveWindows(): void {
    this.items = this.activeWindows;
  }
}
</script>

<style module lang="scss">
.tabs {
  display: flex;
  height: 100%;
  align-items: flex-end;
  margin-left: 1px;
}
</style>
