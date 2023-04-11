<template>
  <div :class="$style['container']">
    <div :class="$style['container__label']">
      {{ label }}
      <span :class="$style['container__label__icon']">
        <slot name="icon" />
      </span>
    </div>
    <slot name="input" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

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

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;

  &__label {
    display: flex;
    align-items: center;
    font-size: 12px;
    margin-bottom: 9px;
    color: var(--secondary-text-color);
    &__icon {
      margin-left: 5px;
    }
  }
}
</style>
