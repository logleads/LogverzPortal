<template>
  <div
    :class="$style['container']"
    :style="{
      zIndex: window.zIndex,
      transform: `translate3d(${left}px, ${top}px, 0)`,
      width: width ? `${width}px` : undefined,
      height: height ? `${height}px` : undefined,
      left: `${SCREEN_WIDTH / 2 - SCREEN_WIDTH / 4}px`,
      userSelect: dragging ? 'none' : 'auto',
    }"
    @click="openWindow"
  >
    <div :class="[$style['inactive-overlay'], { [$style['inactive-overlay--on']]: !isFocused }]" />
    <div :class="$style['top-panel']" @mousedown="handleDragStart">
      <div :class="$style['top-panel__label']">
        <p :class="$style['window-name-p']">{{ window.index }}</p>
        <input
          ref="windowName"
          v-model="title"
          type="text"
          :class="$style['window-name']"
          maxlength="30"
          @input="changeWindowName"
        />
      </div>
      <p ref="pHideElement" :class="$style['hiden']"></p>
      <div :class="$style['top-panel__controls']">
        <button type="button" :class="$style['top-panel__control-btn']" @click="minimizeWindow">
          <Icon name="window-minimize" :width="15" :height="4" />
        </button>
        <button type="button" :class="$style['top-panel__control-btn']" @click="toggleFullScreen">
          <Icon name="window-fullscreen" :width="15" :height="15" />
        </button>
        <button
          type="button"
          :class="$style['top-panel__control-btn']"
          @click="closeWindow($event, index)"
        >
          <Icon name="window-close" :width="12" :height="12" />
        </button>
      </div>
    </div>
    <template
      v-for="side in resizeSides"
      :key="side"
      :class="[
        $style['resize-side'],
        $style[`resize-side--${side}`],
        { [$style['resize-side--off']]: fullscreen },
      ]"
      @mousedown="handleResizeStart($event, side)"
    ></template>
    <div :class="$style['content']">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref, watch } from 'vue';

import Icon from '~/components/shared/icon.vue';
import { UserModule } from '~/store/modules/user';
import { WindowData, WindowsModule } from '~/store/modules/windows';

enum ResizeSide {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
  LT = 'lt',
  RT = 'rt',
  LB = 'lb',
  RB = 'rb',
}

const resizeSide = [
  ResizeSide.TOP,
  ResizeSide.RIGHT,
  ResizeSide.BOTTOM,
  ResizeSide.LEFT,
  ResizeSide.LT,
  ResizeSide.RT,
  ResizeSide.LB,
  ResizeSide.RB,
];

const topSides = [ResizeSide.TOP, ResizeSide.LT, ResizeSide.RT] as Nullable<ResizeSide>[];
const bottomSides = [ResizeSide.BOTTOM, ResizeSide.LB, ResizeSide.RB] as Nullable<ResizeSide>[];
const rightSides = [ResizeSide.RIGHT, ResizeSide.RT, ResizeSide.RB] as Nullable<ResizeSide>[];
const leftSides = [ResizeSide.LEFT, ResizeSide.LT, ResizeSide.LB] as Nullable<ResizeSide>[];

const TOP_MARGIN = 50;
const MIN_SIZE = 300;
const HEADER_HEIGHT = 73;

// @Component({
//   name: 'Window',
//   components: { Icon, Input },
// })
export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Window',
  components: { Icon },
  props: {
    window: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: false,
    },
  },
  // @Prop({ required: true, type: Object }) readonly window!: WindowData;
  setup(props) {
    const windowName: Ref<HTMLInputElement | any> = ref(null);
    const pHideElement: Ref<HTMLParagraphElement | any> = ref(null);

    const top: Ref<number> = ref(0);
    const right: Ref<number> = ref(0);
    const bottom: Ref<number> = ref(0);
    const left: Ref<number> = ref(0);

    const width: Ref<number> = ref(0);
    const height: Ref<number> = ref(0);

    const moveStartPosition: Ref<{
      x: number;
      y: number;
      left: number;
      top: number;
      bottom: number;
      right: number;
    }> = ref({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    });

    const SCREEN_WIDTH: Ref<number> = ref(0);
    const SCREEN_HEIGHT: Ref<number> = ref(0);
    const INITIAL_WINDOW_WIDTH: Ref<number> = ref(0);
    const INITIAL_WINDOW_HEIGHT: Ref<number> = ref(0);

    const dragging: Ref<boolean> = ref(false);
    const fullscreen: Ref<boolean> = ref(false);

    const currentResizeSide: Ref<Nullable<ResizeSide>> = ref(null);

    const title: Ref<string> = ref(props.window.windowName);

    SCREEN_WIDTH.value = document.body.offsetWidth;
    SCREEN_HEIGHT.value = document.body.offsetHeight;

    INITIAL_WINDOW_WIDTH.value = SCREEN_WIDTH.value / 1.8;
    INITIAL_WINDOW_HEIGHT.value = SCREEN_HEIGHT.value / 1.2;

    width.value = INITIAL_WINDOW_WIDTH.value;
    height.value = INITIAL_WINDOW_HEIGHT.value;

    onMounted(async () => {
      resizeInput();
    });

    function resizeInput() {
      pHideElement.value.innerText = title.value;
      windowName.value.style.width = pHideElement.value?.clientWidth + 22 + 'px';
    }

    const resizeSides: ComputedRef<ResizeSide[]> = computed(() => {
      return resizeSide;
    });

    const isFocused: ComputedRef<boolean> = computed(() => {
      return WindowsModule.activeWindowsIndex === props.window.index;
    });

    function handleDragStart(e: MouseEvent): void {
      if (fullscreen.value) {
        return;
      }

      moveStartPosition.value = {
        x: e.pageX,
        y: e.pageY,
        top: top.value,
        right: right.value,
        bottom: bottom.value,
        left: left.value,
      };

      dragging.value = true;

      document.documentElement.addEventListener('mousemove', handleDragMove);
      document.documentElement.addEventListener('mouseup', handleDragStop);
    }

    function handleDragMove(e: MouseEvent): void {
      e.stopPropagation();

      const x = e.pageX;
      const y = e.pageY;

      const deltaX = moveStartPosition.value.x - x;
      let deltaY = moveStartPosition.value.y - y;

      let top_local = moveStartPosition.value.top - deltaY;
      let bottom_local = moveStartPosition.value.bottom + deltaY;
      const left_local = moveStartPosition.value.left - deltaX;
      const right_local = moveStartPosition.value.right + deltaX;

      if (top_local < -TOP_MARGIN) {
        deltaY = deltaY + (TOP_MARGIN + top_local);
        top_local = moveStartPosition.value.top - deltaY;
        bottom_local = moveStartPosition.value.bottom + deltaY;
      }

      top.value = top_local;
      bottom.value = bottom_local;
      right.value = right_local;
      left.value = left_local;
    }

    function handleDragStop(): void {
      resetMoveStartPosition();

      dragging.value = false;

      document.documentElement.removeEventListener('mousemove', handleDragMove);
      document.documentElement.removeEventListener('mouseup', handleDragStop);
    }

    function handleResizeStart(e: MouseEvent, side: ResizeSide): void {
      e.preventDefault();
      e.stopPropagation();

      moveStartPosition.value = {
        x: e.pageX,
        y: e.pageY,
        top: top.value,
        right: right.value,
        bottom: bottom.value,
        left: left.value,
      };

      currentResizeSide.value = side;

      document.documentElement.addEventListener('mousemove', handleResizeMove);
      document.documentElement.addEventListener('mouseup', handleResizeStop);
    }

    function handleResizeMove(e: MouseEvent): void {
      e.stopPropagation();

      if (fullscreen.value) {
        return;
      }

      const x = e.pageX;
      const y = e.pageY;

      let deltaX = moveStartPosition.value.x - x;
      let deltaY = moveStartPosition.value.y - y;

      let top_local = top.value;
      let bottom_local = bottom.value;
      let right_local = right.value;
      let left_local = left.value;

      if (topSides.includes(currentResizeSide.value)) {
        top_local = moveStartPosition.value.top - deltaY;
        const height = Math.floor(INITIAL_WINDOW_HEIGHT.value - top_local - bottom_local);

        if (height < MIN_SIZE) {
          deltaY = deltaY + (MIN_SIZE - height);
          top_local = moveStartPosition.value.top - deltaY;
        }

        if (top_local < -TOP_MARGIN) {
          top_local = -TOP_MARGIN;
        }
      }

      if (bottomSides.includes(currentResizeSide.value)) {
        bottom_local = moveStartPosition.value.bottom + deltaY;
        const height = Math.floor(INITIAL_WINDOW_HEIGHT.value - top_local - bottom_local);

        if (height < MIN_SIZE) {
          deltaY = deltaY - (MIN_SIZE - height);
          bottom_local = moveStartPosition.value.bottom + deltaY;
        }
      }

      if (leftSides.includes(currentResizeSide.value)) {
        left_local = moveStartPosition.value.left - deltaX;
        const width = INITIAL_WINDOW_WIDTH.value - left_local - right_local;

        if (width < MIN_SIZE) {
          deltaX = deltaX + (MIN_SIZE - width);
          left_local = moveStartPosition.value.left - deltaX;
        }
      }

      if (rightSides.includes(currentResizeSide.value)) {
        right_local = moveStartPosition.value.right + deltaX;
        const width = INITIAL_WINDOW_WIDTH.value - left_local - right_local;

        if (width < MIN_SIZE) {
          deltaX = deltaX - (MIN_SIZE - width);
          right_local = moveStartPosition.value.right + deltaX;
        }
      }

      const width_local = INITIAL_WINDOW_WIDTH.value - left_local - right_local;
      const height_local = INITIAL_WINDOW_HEIGHT.value - top_local - bottom_local;

      top.value = top_local;
      bottom.value = bottom_local;
      left.value = left_local;
      right.value = right_local;

      width.value = width_local;
      height.value = height_local;
    }

    function handleResizeStop(): void {
      resetMoveStartPosition();
      currentResizeSide.value = null;

      document.documentElement.removeEventListener('mousemove', handleResizeMove);
      document.documentElement.removeEventListener('mouseup', handleResizeStop);
    }

    function resetMoveStartPosition(): void {
      moveStartPosition.value = { x: 0, y: 0, top: 0, right: 0, bottom: 0, left: 0 };
    }

    function toggleFullScreen(): void {
      fullscreen.value = !fullscreen.value;

      if (fullscreen.value) {
        top.value = -TOP_MARGIN;
        right.value = SCREEN_WIDTH.value;
        bottom.value = SCREEN_HEIGHT.value;
        left.value = -(SCREEN_WIDTH.value / 4);

        width.value = SCREEN_WIDTH.value;
        height.value = SCREEN_HEIGHT.value - HEADER_HEIGHT;
      } else {
        top.value = 0;
        right.value = 0;
        bottom.value = 0;
        left.value = 0;
        width.value = INITIAL_WINDOW_WIDTH.value;
        height.value = INITIAL_WINDOW_HEIGHT.value;
      }
    }

    function closeWindow(e: Event, index: any): void {
      e.stopPropagation();
      if (props.window.name === 'terms-window') {
        UserModule.toggleDisplayTerms(false);
      }
      if (props.window.name === 'privacy-policy-window') {
        UserModule.toggleDisplayPrivacy(false);
      }
      if (props.window.name === 'settings-window') {
        UserModule.toggleDisplayUserSettings(false);
      }
      WindowsModule.closeWindow(index);
    }

    function openWindow(): void {
      if (!isFocused.value) {
        WindowsModule.openWindow({ name: props.window.name, index: props.window.index });
      }
    }

    function minimizeWindow(e: Event): void {
      e.stopPropagation();
      WindowsModule.minimizeWindow(props.window.index);
    }

    function changeWindowName(): void {
      resizeInput();
      if (title.value.length < 30) {
        WindowsModule.editWindowName(title.value);
      }
    }
    const activeWindows: ComputedRef<WindowData[]> = computed(() => {
      return WindowsModule.activeWindows;
    });

    watch(activeWindows, () => {
      title.value = props.window.windowName;
    });

    watch(props.window, () => {
      // console.log('inside watch', props.window);
      title.value = props.window.windowName;
    });
    return {
      changeWindowName,
      minimizeWindow,
      openWindow,
      closeWindow,
      toggleFullScreen,
      resetMoveStartPosition,
      handleResizeStop,
      handleResizeMove,
      handleResizeStart,
      handleDragStop,
      handleDragStart,
      handleDragMove,
      isFocused,
      resizeInput,
      resizeSides,
      dragging,
      fullscreen,
      title,
      SCREEN_WIDTH,
      SCREEN_HEIGHT,
      INITIAL_WINDOW_WIDTH,
      INITIAL_WINDOW_HEIGHT,
      currentResizeSide,
      moveStartPosition,
      width,
      height,
      windowName,
      top,
      right,
      bottom,
      left,
      pHideElement,
    };
  },
});
</script>

<style module lang="scss">
.hiden {
  opacity: 0;
}
.window-name {
  // width: 320px;
  padding: 10px;
}

.window-name-p {
  padding: 5px;
}
.container {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  overflow: hidden;
  position: absolute;
  top: 50px;
}

.inactive-overlay {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.4);
  z-index: 21;

  &--on {
    display: block;
  }
}

.top-panel {
  background-color: var(--header-color);
  height: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1px;

  &__label {
    font-weight: 500;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__label:hover {
    border: 1px solid white;
    border-radius: 6px;
    // cursor: pointer;
    // cursor: auto;
    cursor: text;
  }

  &__controls {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 20px;
    align-items: center;
    padding-right: 10px;
  }

  &__control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 15px;
    color: #fff;
    cursor: pointer;
  }
}

.resize-side {
  position: absolute;
  z-index: 20;

  &--left,
  &--right {
    top: 10px;
    bottom: 10px;
    width: 3px;
    cursor: ew-resize;
  }

  &--left,
  &--lt,
  &--lb {
    left: 0;
  }

  &--right,
  &--rt,
  &--rb {
    right: 0;
  }

  &--top,
  &--bottom {
    left: 10px;
    right: 10px;
    height: 3px;
    cursor: ns-resize;
  }

  &--top,
  &--lt,
  &--rt {
    top: 0;
  }

  &--bottom,
  &--lb,
  &--rb {
    bottom: 0;
  }

  &--lt,
  &--lb,
  &--rt,
  &--rb {
    width: 10px;
    height: 10px;
  }

  &--rt,
  &--lb {
    cursor: nesw-resize;
  }

  &--lt,
  &--rb {
    cursor: nwse-resize;
  }

  &--off {
    cursor: auto;
  }
}

.content {
  background-color: #fff;
  height: 100%;
}

.btn {
  background-color: white;
  color: var(--accent-color);
  width: 140px;
  height: 45px;
  border: 1px solid var(--accent-color);
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s linear;

  &:hover {
    background-color: var(--accent-color);
    color: #fff;
    transition: all 0.3s linear;
  }
}

.winsowNameFields {
  display: flex;
}
</style>
