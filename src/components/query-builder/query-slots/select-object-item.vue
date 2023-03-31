<template>
  <div
    ref="select"
    :class="$style['input-drop-down']"
    contenteditable="true"
    disabled="true"
    @blur="handleBlur"
  >
    <label contenteditable="false">
      <input contenteditable="false" type="text" disabled :value="selectedRuleRef.label || ''" />
      <div v-if="!scopedExpanded" contenteditable="false" @click="toggleShow">
        <Icon name="arrow-down" :class="$style['input-arrow-down']" :width="9" :height="6" />
      </div>
      <div v-else contenteditable="false" @click="toggleShow">
        <Icon name="arrow-up" :class="$style['input-arrow-down']" :width="9" :height="6" />
      </div>
    </label>
    <div
      v-if="scopedExpanded"
      :class="[$style['input-unwrapped'], { [$style['up-direction']]: direction }]"
      contenteditable="false"
    >
      <div
        v-for="item in itemRef"
        :key="item.id + Math.random() * 10000"
        :class="$style['input-unwrapped__item']"
        contenteditable="false"
        @click="handleClick($event, item)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, Ref, ref, watch } from '@vue/composition-api';

import Icon from '~/components/shared/icon.vue';

export default defineComponent({
  name: 'SelectObjectItem',
  components: { Icon },
  props: {
    expanded: {
      type: Boolean,
      required: false,
    },
    items: {
      type: Array as PropType<any>,
      required: false,
    },
    direction: {
      type: Boolean,
      required: false,
    },
    selectedRule: {
      type: Object as PropType<any>,
      required: false,
    },
  },
  // @Prop({ required: false, type: Boolean }) readonly expanded!: boolean;
  // @Prop({ required: false, type: Array }) readonly items!: Array<unknown>;
  // @Prop({ required: false, type: Boolean }) readonly direction!: boolean;
  // @Prop({ required: false }) readonly selectedRule!: unknown;
  setup(props, { emit }) {
    const scopedExpanded = ref(false);
    const select: Ref<HTMLDivElement | any> = ref(null);
    const itemRef: any = ref(props.items);
    const selectedRuleRef: any = ref(props.selectedRule);

    watch(itemRef, () => {
      emit('select', itemRef.value[0]);
    });

    function handleBlur(): void {
      scopedExpanded.value = false;
    }

    watch(scopedExpanded, (val: boolean) => {
      if (val) {
        select.value?.focus();
      } else {
        select.value?.blur();
      }
    });

    function toggleShow(): void {
      scopedExpanded.value = !scopedExpanded.value;
    }

    function handleClick(event: Event, item: any): void {
      event.stopPropagation();
      emit('select', item);
      select.value.blur();
    }
    return {
      handleClick,
      toggleShow,
      handleBlur,
      scopedExpanded,
      select,
      itemRef,
      selectedRuleRef,
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
