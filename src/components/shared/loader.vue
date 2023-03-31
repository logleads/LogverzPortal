<template>
  <div
    :class="[$style['loader'], { [$style['loader--accent']]: accent }]"
    :style="{ width: `${size}px`, height: `${size}px` }"
  ></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'Loader',
})
export default class Loader extends Vue {
  @Prop({ default: false, type: Boolean }) readonly accent!: boolean;
  @Prop({ default: 40, type: Number }) readonly size!: number;
}
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
