<template>
  <div
    :class="[$style['loader'], { [$style['loader--accent']]: accent }]"
    :style="{ width: `${size}px`, height: `${size}px` }"
  ></div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Loader',
  props: {
    accent: {
      type: Boolean,
      required: false,
      default: false,
    },
    size: {
      type: Number,
      required: false,
      default: 40,
    },
  },
});
</script>

<style module lang="scss">
.loader {
  --color: #fff;

  &::after {
    content: '';
    display: block;
    width: calc(100% - 8px);
    height: calc(100% - 8px);
    margin: 4px;
    border-radius: 50%;
    border: 3px solid var(--color);
    border-color: var(--color) transparent var(--color) transparent;
    animation: dual-ring 1.2s linear infinite;
  }

  &--accent {
    --color: var(--accent-color);
  }
}

@keyframes dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
