<template>
  <div>
    <span :class="$style['container__key']">{{ title }}: </span>
    <span :class="$style['container__value']">{{ value }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'JsonViewerCustom',
})
export default class InfoMsgSpan extends Vue {
  @Prop({ required: true, type: String }) readonly title!: string;
  @Prop({ required: true, type: String }) readonly value!: string;
}
</script>

<style module lang="scss">
.container {
  &__key {
    font-size: 14px;
    color: var(--accent-color);
  }

  &__value {
    font-size: 13px;
    color: #000000;
  }
}
</style>
