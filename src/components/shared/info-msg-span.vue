<template>
  <div>
    <span :class="$style['container__key']">{{ title }}: </span>
    <span :class="$style['container__value']">{{ value }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'JsonViewerCustom',
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
});
</script>

<style module lang="scss">
.container {
  &__key {
    font-size: 14px;
    color: var(--accent-color);
  }

  &__value {
    font-size: 13px;
    color: #000000;
  }
}
</style>
