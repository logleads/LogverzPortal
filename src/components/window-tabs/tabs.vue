<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <Draggable
    v-model="items"
    class="tabs"
    item-key="index"
    @start="dragging = true"
    @end="dragging = false"
  >
    <template #item="{ element }">
      <TabItem
        :key="element.index"
        :index="element.index"
        :key-c="element.index"
        :item="element"
        :dragging="dragging"
      >
        {{ element.name }}
      </TabItem>
    </template>
  </Draggable>
</template>
<script lang="ts">
import { computed, ComputedRef, defineComponent, Ref, ref, watchEffect } from 'vue';
import Draggable from 'vuedraggable';

import { WindowData, WindowsModule } from '~/store/modules/windows';

import TabItem from './tab-item.vue';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
  name: 'Header',
  components: {
    Draggable,
    TabItem,
  },
  setup() {
    const items: Ref<WindowData[]> = ref([]);
    const dragging: Ref<boolean> = ref(false);

    const activeWindows: ComputedRef<Array<WindowData>> = computed(() => {
      return WindowsModule.activeWindows;
    });

    watchEffect(() => {
      items.value = [...WindowsModule.activeWindows];
    });

    return {
      items,
      dragging,
      activeWindows,
    };
  },
});
</script>

<style  scoped lang="scss">
.tabs {
  display: flex;
  height: 100%;
  align-items: flex-end;
  margin-left: 1px;
}
</style>
