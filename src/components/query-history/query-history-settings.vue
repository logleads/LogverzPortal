<template>
  <div>
    <json-viewer :value="reshapedData" :expand-depth="5" sort></json-viewer>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue';

export default defineComponent({
  name: 'QueryHistorySettings',
  components: {},
  props: {
    data: {
      type: Object,
      required: false,
    },
  },
  setup(props) {
    // @Prop({ required: false, type: Object }) readonly data!: Record<string, any>;
    const reshapedData: Ref<any> = ref({});
    onMounted(() => {
      reshapedData.value = JSON.parse(JSON.stringify(props.data));
      delete reshapedData.value.displayButton;
      delete reshapedData.value.displayAccess;
      delete reshapedData.value.displayOwners;
    });
    return {
      reshapedData,
    };
  },
});
</script>

<style module lang="scss">
.container {
  margin: 15px 0;

  &__key {
    font-size: 14px;
    color: var(--accent-color);
  }

  &__value {
    font-size: 13px;
    color: #000000;
    display: inline-block;
    word-wrap: break-word;
    width: 100%;
    white-space: normal;
  }
}
</style>
