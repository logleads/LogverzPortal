<template>
  <div
    ref="select"
    :class="$style['input-drop-down']"
    contenteditable="true"
    @blur="handleBlur"
    @click="toggleShow"
  >
    <label contenteditable="false">
      <input contenteditable="false" type="text" disabled :value="selectedRule?.label || ''" />
      <div v-if="!scopedExpanded" contenteditable="false">
        <Icon name="arrow-down" :class="$style['input-arrow-down']" :width="9" :height="6" />
      </div>
      <div v-else contenteditable="false">
        <Icon name="arrow-up" :class="$style['input-arrow-down']" :width="9" :height="6" />
      </div>
    </label>
    <div
      v-if="scopedExpanded"
      contenteditable="false"
      :class="[$style['input-unwrapped'], { [$style['up-direction']]: direction }]"
    >
      <div
        v-for="item in locItem"
        :key="item?.id + Math.random() * 10000"
        contenteditable="false"
        :class="$style['input-unwrapped__item']"
        @click="handleClick($event, item)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, watch } from 'vue';

// @Component({
//   name: 'CollectionSelectObject',
//   components: { Icon },
// })
export default defineComponent({
  name: 'CollectionSelectObject',
  components: {},
  props: {
    expanded: {
      type: Boolean,
    },
    items: {
      type: Array,
    },
    direction: {
      type: Boolean,
    },
    selectedRule: {
      type: Object,
    },
    disabled: {
      type: Boolean,
    },
  },
  // @Prop({ required: false, type: Boolean }) readonly expanded!: boolean;
  // @Prop({ required: false, type: Array }) readonly items!: Array<unknown>;
  // @Prop({ required: false, type: Boolean }) readonly direction!: boolean;
  // @Prop({ required: false }) readonly selectedRule!: unknown;
  // @Prop({ required: false, type: Boolean }) readonly disabled!: boolean;
  setup(props, { emit }) {
    const locItem: Array<any> = props.items as Array<any>;
    const scopedExpanded: Ref<boolean> = ref(false);
    // $refs!: {
    //   select: HTMLDivElement;
    // };
    const select: any = ref<HTMLDivElement | null>(null);
    watch(locItem, () => {
      emit('select', locItem[0]);
    });

    function handleBlur(): void {
      scopedExpanded.value = false;
    }

    function toggleShow(): void {
      if (!props.disabled) {
        scopedExpanded.value = !scopedExpanded.value;
      }
    }

    watch(scopedExpanded, (value: boolean) => {
      if (value) {
        select.focus();
      } else {
        select.blur();
      }
    });

    function handleClick(event: Event, item: unknown): void {
      event.stopPropagation();
      emit('select', item);
      select.blur();
    }
    return {
      handleClick,
      toggleShow,
      handleBlur,
      select,
      scopedExpanded,
      locItem,
    };
  },
});
</script>

<style module lang="scss">
.input-drop-down {
  max-width: 100%;
  position: relative;
  & input {
    font-weight: 500;
    font-size: 12px;
    line-height: 1;
    width: 100%;
    height: 44px;
    padding-left: 18px;
    margin: 12px 0;
    border-radius: 5px;
    border: 1px solid rgba(159, 166, 177, 0.22);
  }
  &:before {
    content: '';
    width: 1px;
    height: 21px;
    background-color: rgba(159, 166, 177, 1);
    position: absolute;
    top: 35%;
    right: 32.5px;
  }
}
.input-arrow-down {
  position: absolute;
  top: 48%;
  right: 13px;
  cursor: pointer;
}
.input-unwrapped {
  background-color: white;
  position: absolute;
  width: 87.5%;
  top: 85%;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
  z-index: 2;
  left: 0;
  max-height: 200px;
  overflow: scroll;
  overflow-x: hidden;
  &.up-direction {
    top: -111%;
  }
  &__item {
    color: var(--ink-color);
    font-size: 14px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 15px 10px;
    cursor: pointer;
    &:hover {
      background: #bcb9b9;
    }
  }
  &::-webkit-scrollbar {
    width: 3px;
    height: 18px;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: var(--accent-color);
    border-radius: 31px;
  }
  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: var(--accent-color);
  }
}
</style>
