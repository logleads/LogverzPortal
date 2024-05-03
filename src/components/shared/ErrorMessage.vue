<template>
  <div v-if="showMessage" :class="$style['error-message']">
    {{ errorMessage }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ErrorMessage',
  props: {
    errorMessage: {
      type: String,
    },
    showMessage: {
      type: Boolean,
    },
  },
});
</script>

<style module lang="scss">
.error-message {
  position: absolute;
  bottom: 10%;
  right: 10%;
  z-index: 100;
  background-color: #fa8f8f;
  color: #b73f3f;
  font-size: 14px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  text-align: center;
  padding: 20px;
}
</style>
