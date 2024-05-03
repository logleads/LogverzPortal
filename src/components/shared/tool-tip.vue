<template>
  <div>
    <div :class="$style['tooltip']">
      <Icon name="exclamation-colored" :class="$style['label-icon']" :width="15" :height="15" />
      <span :class="$style['tooltiptext']">{{ tip }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Icon from '~/components/shared/icon.vue';

// @Component({
//   name: 'ToolTip',
//   components: { Icon },
// })
export default defineComponent({
  name: 'ToolTip',
  components: { Icon },
  // @Prop({ required: false, type: String }) readonly tip!: string;
  props: {
    tip: {
      type: String,
      required: false,
    },
  },
});
</script>

<style module lang="scss">
.label-icon {
  color: var(--accent-color);
}

/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  background-color: white;
  width: 320px;
  color: var(--blue-text-color);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  text-align: center;
  padding: 5px;
  border-radius: 6px;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
