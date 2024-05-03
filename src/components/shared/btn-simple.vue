<template>
  <div :class="$style['buttons']">
    <button
      :class="[
        $style['buttons__btn'],
        $style['border-radius'],
        disable ? $style['disable'] : $style['active'],
      ]"
      :disabled="disable"
      @click.stop="e => clicked(e)"
    >
      {{ btnText }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SimpleBtn',
  props: {
    btnText: {
      type: String,
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  // @Prop({ required: true, type: String }) readonly btnText!: string;
  // @Prop({ required: false, type: Boolean }) readonly disable!: boolean;
  setup(props, { emit }) {
    // @Emit('clicked')
    function clicked(e: Event): void {
      e.preventDefault();
      e.stopPropagation();
      emit('clicked', e);
    }
    return {
      clicked,
    };
  },
});
</script>

<style module lang="scss">
.buttons {
  padding: 0 4px;
  display: flex;
  align-items: center;
  width: 133px;
  height: 35px;

  &__btn {
    width: 111px;
    height: 27px;
    font-weight: 500;
    font-size: 12px;
    color: #242222;
    background-color: #ffffff;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.03);

    &.active {
      background-color: #88c4be;
      font-weight: 500;
      font-size: 12px;
      color: white;
      box-shadow: none;
    }
  }
}

.border-radius {
  border-radius: 5px;
  border-radius: 5px;
}

.disable {
  background-color: #373d3c;
  font-weight: 500;
  font-size: 12px;
  color: white;
  box-shadow: none;
}
</style>
