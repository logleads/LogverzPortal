<template>
  <div :class="$style['container']">
    <div v-if="type === 'password'" :class="$style['password-icon']">
      <icon name="lock" />
    </div>
    <input
      :type="type"
      :class="[
        $style['input'],
        { [$style['input__error']]: error },
        { [$style['height-44']]: fromQueryBuilder },
      ]"
      :value="value"
      :min="min"
      :name="name"
      :disabled="disabled"
      :placeholder="placeholder"
      @input="handleInputChange($event.target.value)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import Icon from './icon.vue';

// @Component({

// })
export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names, vue/multi-word-component-names
  name: 'Input',
  components: { Icon },
  props: {
    value: {
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
    function handleInputChange(value: string) {
      emit('input', value);
    }
    return {
      handleInputChange,
    };
  },
});
</script>

<style module lang="scss">
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
  font-size: 12px;
  font-weight: 500;
  padding: 0 $inputPadding;
  width: 100%;
  height: 30px;
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
