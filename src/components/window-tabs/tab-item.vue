<template>
  <button
    type="button"
    :class="[
      $style['tab'],
      {
        [$style['tab--active']]: activeWindowsIndex === item.index,
        [$style['tab--dragging']]: dragging,
      },
    ]"
    @click="openWindow(item.name, item.index)"
  >
    <div :class="$style['tab__body']">
      <div :class="$style['tab__label']">
        {{ `${keyC} ${item.windowName}` }}
      </div>
      <button
        v-if="activeWindowsIndex === item.index"
        type="button"
        :class="$style['tab__close-btn']"
        @click="closeWindow($event, item.index)"
      >
        <Icon name="window-close" :width="7" :height="7" />
      </button>
      <div :class="$style['tab__bottom-line']" />
    </div>
  </button>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, getCurrentInstance } from 'vue';

import Icon from '~/components/shared/icon.vue';
import { WindowName, WindowsModule } from '~/store/modules/windows';

export default defineComponent({
  name: 'TabItem',
  components: { Icon },
  props: {
    item: {
      type: Object,
      required: true,
    },
    dragging: {
      type: Boolean,
      required: true,
    },
    keyC: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const instance = getCurrentInstance();
    const key = instance?.vnode.key;
    console.log('INSIDE TAB_ITEM: ', props.item);
    const focusedWindow: ComputedRef<Nullable<WindowName>> = computed(() => {
      return WindowsModule.focusedWindow;
    });

    const activeWindowsIndex: ComputedRef<Nullable<number>> = computed(() => {
      return WindowsModule.activeWindowsIndex;
    });

    function openWindow(name: WindowName, index: number): void {
      WindowsModule.openWindow({ name, index });
    }

    function closeWindow(event: Event, index: number): void {
      event.stopPropagation();
      WindowsModule.closeWindow(index);
    }

    return {
      closeWindow,
      openWindow,
      activeWindowsIndex,
      focusedWindow,
      key,
    };
  },
});
</script>

<style module lang="scss">
.tab {
  margin: 0 12px;
  height: 44px;
  cursor: pointer;
  display: flex;
  position: relative;

  &--active &__bottom-line {
    display: block;
  }

  &__bottom-line {
    display: none;
    background-color: #7e7e7e;
    position: absolute;
    left: -12px;
    right: -12px;
    bottom: 0;
    height: 12px;

    &::before,
    &::after {
      content: '';
      display: block;
      background-color: var(--header-color);
      height: 12px;
      width: 12px;
      position: absolute;
    }

    &::before {
      left: 0;
      border-radius: 0 0 12px 0;
    }

    &::after {
      right: 0;
      border-radius: 0 0 0 12px;
    }
  }

  &__body {
    display: flex;
    align-items: center;
    height: 100%;
    border-radius: 12px 12px 0 0;
    padding: 0 40px 8px 20px;
  }

  &--active &__body {
    background-color: #7e7e7e;
  }

  &__label {
    font-weight: 500;
    color: #fff;
  }

  &__close-btn {
    width: 19px;
    height: 19px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    position: absolute;
    right: 10px;
  }
}
</style>
