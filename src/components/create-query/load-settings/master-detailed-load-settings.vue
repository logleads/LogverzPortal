<template>
  <div>
    <div v-if="rawitems && Object.keys(rawitems).length > 0 && format === 'json'">
      <json-viewer-custom :value="customizedData" />
    </div>
    <div v-else>
      <template>
        <DxDataGrid
          :columns="csvHeader"
          :show-borders="true"
          :column-auto-width="true"
          :column-resizing-mode="currentMode"
          :data-source="[{ ...customizedData }]"
          word-wrap-enabled="true"
        >
          <DxColumn caption="Creator" data-field="UsersQuery" />
        </DxDataGrid>
      </template>
      <!-- <template v-for="item in Object.keys(customizedData)">
        <div
          v-if="
            (item !== 'UsersQuery') &
            (item !== 'UnixTime') &
            (item !== 'DatasetName') &
            (item !== '0') &
            (item !== '1') &
            (item !== 'rawindex') &
            (item !== 'S3Folders')
          "
          :key="item + Math.random() * 100000"
          :class="$style['container']"
        >
          <span :class="$style['container__key']">{{ item }}: </span>
          <div :class="$style['container__value']">{{ customizedData[item] }}</div>
        </div>
      </template> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, Ref, ref } from 'vue';
import { DxColumn, DxDataGrid } from 'devextreme-vue/data-grid';

export default defineComponent({
  name: 'MasterDetailedLoadSettings',
  components: { DxDataGrid, DxColumn },
  props: {
    data: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    format: {
      type: String,
      required: false,
    },
  },
  setup(props, { emit }) {
    const customizedData! = ref(props.data.data);
    const csvHeader: Ref<any> = ref([]);
    const columnsData = ref([]);
    const resizingModes = ref(['nextColumn', 'widget']);
    const currentMode = ref('nextColumn');

    //  customizedData.value = props.data.data;

    if (Object.keys(customizedData.value).length > 0) {
      const blackList = [
        'UsersQuery',
        'UnixTime',
        // 'DatasetName',
        '0',
        '1',
        'rawindex',
        'S3Folders',
      ];
      let csvkeys = Object.keys(customizedData.value);
      csvHeader.value = csvkeys.forEach((e1, idx, arr) => {
        if (blackList.includes(e1)) {
          arr.splice(idx, 1);
        }
      });
    }
    // eslint-disable-next-line no-console
    console.log('customizedData', customizedData.value);
    return {
      currentMode,
      resizingModes,
      columnsData,
      csvHeader,
      customizedData,
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
