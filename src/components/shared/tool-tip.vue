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

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  background-color: white;
  color: var(--blue-text-color);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  text-align: center;
  padding: 10px;
  border-radius: 6px;
  font-family: 'Roboto', sans-serif;
  width: 320px;

  /* Positioning */
  position: absolute;
  bottom: 125%; /* Adjust as needed */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;

  /* Arrow styling */
  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 10px;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

</style>
