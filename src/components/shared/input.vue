<template>
  <div class="container">
    <div v-if="type === 'password'" class="password-icon">
      <icon name="lock" />
    </div>
    <input
      :type="type"
      :class="[
        'input',
        { 'input__error': error },
        { 'height-44': fromQueryBuilder },
      ]"
      :value="modelValue"
      :min="min"
      :name="name"
      :disabled="disabled"
      :placeholder="placeholder"
      @input="handleInputChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Icon from './icon.vue';

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names, vue/multi-word-component-names
  name: 'Input',
  components: { Icon },
  props: {
    modelValue: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
      default: 'text',
    },
    name: {
      type: String,
      required: false,
    },
    min: {
      type: Number,
      required: false,
    },
    error: {
      type: Boolean,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    fromQueryBuilder: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { emit }) {
    function handleInputChange(e: Event) {
      const input = e.target as HTMLInputElement;
      console.log('Input', input.value);
      emit('update:modelValue', input.value);
    }
    return {
      handleInputChange,
    };
  },
});
</script>

<style scoped lang="scss">
$inputPadding: 16px;
$iconSize: 16px;

.container {
  position: relative;
  // margin-bottom: 25px;
}

.password-icon {
  display: flex;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: $inputPadding;
  width: $iconSize;
  height: $iconSize;
}

.height-44 {
  height: 44px !important;
}
.input {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  padding: 0 $inputPadding;
  width: 100%;
  margin-top: 5px;
  height: 40px;
  transition: background 0.1s linear;
  &__error {
    border: 1px solid red;
  }

  &[type='password'] {
    padding-left: $inputPadding + $iconSize + 10px;
    letter-spacing: 0.135em;
  }
}
</style>
