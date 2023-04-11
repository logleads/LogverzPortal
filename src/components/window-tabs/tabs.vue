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
import { computed, ComputedRef, defineComponent, Ref, ref, watch } from '@vue/composition-api';
import Draggable from 'vuedraggable';

import { WindowData, WindowsModule } from '~/store/modules/windows';

import TabItem from './tab-item.vue';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
  name: 'Header',
  components: { Draggable, TabItem },
  setup() {
    const items: Ref<WindowData[]> = ref([]);
    const dragging: Ref<boolean> = ref(false);

    const activeWindows: ComputedRef<Array<WindowData>> = computed(() => {
      return WindowsModule.activeWindows;
    });

    watch(activeWindows, () => {
      items.value = activeWindows.value;
    });
    return {
      items,
      dragging,
      activeWindows,
    };
  },
});
</script>

<style module lang="scss">
.tabs {
  display: flex;
  height: 100%;
  align-items: flex-end;
  margin-left: 1px;
}
</style>
