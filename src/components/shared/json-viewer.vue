<template>
  <div>
    <span :class="$style['container__key']">{{ title }}</span>
    <json-viewer :value="value" :expand-depth="expandDepth" copyable boxed sort></json-viewer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'JsonViewerCustom',
})
export default class JsonViewerCustom extends Vue {
  @Prop({ required: false, type: String }) readonly title!: string;
  @Prop({ required: false, type: Boolean }) readonly sort!: boolean;
  @Prop({ required: false, type: Boolean }) readonly boxed!: boolean;
  @Prop({ required: false, type: Boolean }) readonly copyable!: boolean;
  @Prop({ required: true }) readonly value!: JSON;
  @Prop({ required: false, default: 5, type: Number }) readonly expandDepth!: number;
}
</script>

<style module lang="scss">
.container {
  &__key {
    font-size: 14px;
    color: var(--accent-color);
  }
}
</style>
