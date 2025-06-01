<template>
  <div>
    <json-viewer-custom :value="formattedData" copyable boxed sort />
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted } from 'vue';
import { DxColumn, DxDataGrid, DxHeaderFilter } from 'devextreme-vue/data-grid';
import JsonViewerCustom from '~/components/shared/json-viewer.vue';

import Loader from '~/components/shared/loader.vue';
import { AdminModule } from '~/store/modules/admin';

export default defineComponent({
  name: 'MasterDetailedRole',
  components: { Loader, DxColumn, DxDataGrid, DxHeaderFilter, JsonViewerCustom },

  // @Prop({ required: false, type: Object }) readonly data!: Record<string, any>;
  // @Prop({ required: false }) readonly usersOfPolicies!: any;
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const formattedData = computed(() => {
      return props.data?.data || {};
    });

    onMounted(async () => {
      console.log('Data received:', formattedData.value);
    });
    return {
      formattedData,
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
    display: block;
    word-wrap: break-word;
    width: 100%;
    white-space: normal;
  }
}
</style>
