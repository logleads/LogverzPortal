<!-- eslint-disable vue/prop-name-casing -->
<!-- eslint-disable vue/prop-name-casing -->
<template>
  <p :class="$style['tooltip']">
    UTC time: {{ UnixTimeNormalFormat }}
    <span :class="$style['tooltip_tooltiptext']">Local time: {{ TimeLocalFormat || '...' }}</span>
  </p>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'TimeFields',
  props: {
    UnixTimeNormalFormat: {
      type: String,
      required: false,
    },
    TimeLocalFormat: {
      type: String,
      required: true,
    },
  },
});
</script>

<style module lang="scss">
.tooltip {
  position: relative;
  display: inline-block;
  z-index: 100;
  width: calc(100% - 10%);

  &_tooltiptext {
    visibility: hidden;
    width: 100%;
    padding: 0 10px 0 10px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;

    /* Position the tooltip */
    position: absolute;
    bottom: -5px;
    right: 0;
    z-index: 1;
  }
}

.tooltip:hover .tooltip_tooltiptext {
  visibility: visible;
}
</style>
