<template>
  <button
    type="button"
    :class="[$style['button'], classAssign]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <template v-if="disabled">
      <template v-if="noLoad">{{ text }}</template>
      <template v-else><Loader /></template>
    </template>
    <template v-if="!disabled">{{ text }}</template>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Loader from '~/components/shared/loader.vue';
export default defineComponent({
  name: 'MyButton',
  components: { Loader },
  props: {
    text: {
      type: String,
    },
    classAssign: {
      type: undefined,
    },
    disabled: {
      type: Boolean,
    },
    noLoad: {
      type: Boolean,
    },
  },
  // @Prop({ required: true, type: String }) readonly text!: string;
  // @Prop({ required: false, type: String }) readonly className!: string;
  // @Prop({ required: false, type: Boolean }) readonly disabled!: boolean;
  // @Prop({ required: false, type: Boolean }) readonly noLoad!: boolean;
});
</script>

<style module lang="scss">
.button {
  background-color: var(--accent-color);
  border-radius: 5px;
  font-weight: bold;
  color: #fff;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.1s linear;
  padding: 15px 24px;
  cursor: pointer;

  &:disabled {
    background-color: gray;
    cursor: auto;
  }
}
</style>
