<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height">
    <use :xlink:href="`#${name}-icon`" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Icon',
  props: {
    name: {
      type: String,
      required: false,
    },
    width: {
      type: Number,
      required: false,
    },
    height: {
      type: Number,
      required: false,
    },
  },
});
</script>
