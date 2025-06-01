<template>
  <div class="container">
    <div class="container__label">
      {{ label }}
      <span class="container__label__icon">
        <slot name="icon" />
      </span>
    </div>
    <slot name="input" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InputContainer',
  props: {
    label: {
      type: String,
      required: false,
    },
  },
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;

  &__label {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-bottom: 9px;
    color: var(--ink-color);
    &__icon {
      margin-left: 5px;
    }
  }
  .container__label {
    margin-bottom: 5px !important;
    font-size: 14px;
    font-weight: bold;
    color: #1a1b20;
  }
}
</style>
