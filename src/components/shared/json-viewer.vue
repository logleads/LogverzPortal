<template>
  <div>
    <span class="container__key">{{ title }}</span>
    <json-viewer :value="value" :expand-depth="expandDepth" copyable boxed sort></json-viewer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'JsonViewerCustom',
  props: {
    title: {
      type: String,
      required: false,
    },
    sort: {
      type: Boolean,
      required: false,
    },
    boxed: {
      type: Boolean,
      required: false,
    },
    copyable: {
      type: Boolean,
      required: false,
    },
    expandDepth: {
      type: Number,
      required: false,
      default: 5,
    },
    value: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss">
.container {
  &__key {
    font-size: 14px;
    color: var(--accent-color);
  }
}
</style>
