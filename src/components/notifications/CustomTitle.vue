<template>
  <h1>{{ itemData.CompanyName }}</h1>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CustomTitle',
  props: {
    itemData: {
      type: Object,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      default: () => {},
    },
  },
});
</script>
