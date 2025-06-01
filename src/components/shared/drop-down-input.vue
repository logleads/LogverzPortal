<template>
  <div
    ref="select"
    class="input-drop-down"
    contenteditable="true"
    @blur="handleBlur"
    @click="toggleShow"
  >
    <label contenteditable="false">
      <input type="text" disabled :value="selectedValue || ''" />
      <div v-if="!scopeExpanded">
        <Icon name="arrow-down" class="input-arrow-down" :width="9" :height="6" />
      </div>
      <div v-else>
        <Icon name="arrow-up" class="input-arrow-down" :width="9" :height="6" />
      </div>
    </label>
    <div
      v-if="scopeExpanded"
      contenteditable="false"
      :class="['input-unwrapped', direction ? 'up-direction' : '']"
      >
      <div
        v-for="(item, i) in items"
        :key="item"
        class="input-unwrapped__item"
        @click="handleClick($event, item)"
      >
        <template v-if="names">
          {{ names[i] }}
        </template>
        <template v-else>
          {{ item }}
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, Ref, ref, watch } from 'vue';

import Icon from '~/components/shared/icon.vue';
// @Component({
//   name: 'DropDownInput',
//   components: { Icon },
// })
export default defineComponent({
  name: 'DropDownInput',
  components: { Icon },
  props: {
    items: {
      type: Array,
      required: true,
    },
    direction: {
      type: Boolean,
    },
    selectedField: {
      type: String,
    },
    names: {
      type: String,
    },
  },
  // @Prop({ required: false, type: Array }) readonly items!: Array<string>;
  // @Prop({ required: false, type: Boolean }) readonly direction!: boolean;
  // @Prop({ required: false, type: String }) readonly selectedField!: string;
  // @Prop({ required: false, type: Array }) readonly names!: Array<string>;
  setup(props, { emit }) {
    const scopeExpanded = ref(false);

    // $refs!: {
    //   select: HTMLDivElement;
    // };
    const select: Ref<HTMLDivElement | any> = ref(null);
    const selectedValue: ComputedRef = computed(() => {
      if (!props.names) {
        return props.selectedField;
      } else if (props.selectedField) {
        return props.names[props.items.indexOf(props.selectedField)];
      } else {
        return '';
      }
    });

    function toggleShow(): void {
      scopeExpanded.value = !scopeExpanded.value;
    }

    function handleClick(event: Event, item: any): void {
      event.stopPropagation();
      emit('select', item);
      select.value.blur();
    }

    watch(scopeExpanded, (value: boolean) => {
      if (value) {
        select.value.focus();
      } else {
        select.value.blur();
      }
    });

    function handleBlur(): void {
      scopeExpanded.value = false;
    }
    return {
      handleBlur,
      handleClick,
      toggleShow,
      selectedValue,
      select,
      scopeExpanded,
    };
  },
});
</script>

<style scoped lang="scss">
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
