<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height">
    <use :xlink:href="`#${name}-icon`" />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'Icon',
})
export default class Icon extends Vue {
  @Prop({ required: true, type: String }) readonly name!: string;
  @Prop({ required: false, type: Number }) readonly width?: number;
  @Prop({ required: false, type: Number }) readonly height?: number;
}
</script>
