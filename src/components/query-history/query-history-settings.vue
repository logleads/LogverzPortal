<template>
  <div v-if="Object.keys(reshapedData).length">
    <json-viewer-custom :value="reshapedData" :expand-depth="5" sort></json-viewer-custom>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue';

import JsonViewerCustom from '~/components/shared/json-viewer.vue';

export default defineComponent({
  name: 'QueryHistorySettings',
  components: { JsonViewerCustom },
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
      reshapedData.value = props.data?.data;
      delete reshapedData.value?.displayButton;
      delete reshapedData.value?.displayAccess;
      delete reshapedData.value?.displayOwners;
    });
    console.log("reshapedData",reshapedData);
    
    return {
      reshapedData,
    };
  },
});
</script>

<style scoped lang="scss">
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
