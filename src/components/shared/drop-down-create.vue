<template>
  <div>
    <div :class="$style['input-drop-down']">
      <!-- {{ isLoadConfigurationUpload }} -->
      <label @click="toggleExpanded">
        <div :class="$style['input-drop-down__block']">
          {{ label }}
        </div>
        <Icon v-if="!isExpanded" name="arrow-down" :class="$style['input-arrow']" :width="12" :height="7.7" />
        <Icon v-if="isExpanded" name="arrow-up" :class="$style['input-arrow']" :width="12" :height="7.7" />
      </label>
    </div>
    <div :class="{ [$style['hidden']]: !isExpanded }">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, watch, WritableComputedRef } from 'vue';

import Icon from '~/components/shared/icon.vue';
import { DataCollectionModule } from '~/store/modules/data-collection';

export default defineComponent({
  name: 'DropDownCreate',
  components: { Icon },
  props: {
    label: {
      type: String,
    },
  },

  setup(props, { emit }) {
    const isExpanded: Ref<boolean> = ref(false);
    function toggleExpanded(): void {
      isExpanded.value = !isExpanded.value;
      if (props.label === 'Review')
        emit('onPress', isExpanded.value)
    }
    const isLoadConfigurationUpload: WritableComputedRef<boolean> = computed(() => {
      return DataCollectionModule.isLoadConfigurationUpload;
    });

    watch(isLoadConfigurationUpload, (value: boolean) => {
      // eslint-disable-next-line no-console
      // console.log('checkLoadConfigurationFlag', value);
      if (props.label === 'Review') isExpanded.value = value;
      // return '';
    });

    return {
      toggleExpanded,
      isExpanded,
      isLoadConfigurationUpload,
    };
  },
});
</script>

<style module lang="scss">
.input-drop-down {
  max-width: 100%;
  position: relative;

  &__block {
    font-weight: 500;
    font-size: 18px;
    color: var(--ink-color);
    line-height: 1;
    width: 100%;
    display: flex;
    align-items: center;
    height: 70px;
    padding-left: 18px;
    border-radius: 5px;
    border: 1.59091px solid var(--secondary-text-color);
    -webkit-touch-callout: none;
    /* iOS Safari */
    -webkit-user-select: none;
    /* Safari */
    -khtml-user-select: none;
    /* Konqueror HTML */
    -moz-user-select: none;
    /* Old versions of Firefox */
    -ms-user-select: none;
    /* Internet Explorer/Edge */
    user-select: none;
  }

  &:before {
    content: '';
    width: 1px;
    height: 33.4px;
    background-color: rgba(159, 166, 177, 1);
    position: absolute;
    top: 33%;
    right: 54px;
  }
}

.input-arrow {
  position: absolute;
  top: 50%;
  right: 23px;
  cursor: pointer;
  width: 12px;
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

.hidden {
  display: none;
}
</style>
