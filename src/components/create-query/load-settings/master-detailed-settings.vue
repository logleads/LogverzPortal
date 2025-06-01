<template>
  <div>
    <div v-if="rawitems && Object.keys(customizedData).length > 0 && format === 'json'">
      <json-viewer-custom :value="customizedData" />
    </div>
    <div v-else-if="Object.keys(customizedData).length">
      <!-- <template> -->
      <DxDataGrid :columns="csvHeader" :show-borders="true" :column-auto-width="true"
        :column-resizing-mode="currentMode" :data-source="[{ ...customizedData }]" word-wrap-enabled="true">
        <DxHeaderFilter :visible="true" />
      </DxDataGrid>
      <!-- </template> -->
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
          class="container"
        >
          <span class="container__key">{{ item }}: </span>
          <div class="container__value">{{ customizedData[item] }}</div>
        </div>
      </template> -->
    </div>
  </div>
</template>

<script lang="ts">
import { DxDataGrid, DxHeaderFilter } from 'devextreme-vue/data-grid';
import { defineComponent, onMounted, Ref, ref } from 'vue';

import JsonViewerCustom from '~/components/shared/json-viewer.vue';

// @Component({
//   name: 'MasterDetailedSettings',
//   components: { ParseObject, Loader, Icon, DxDataGrid },
// })
export default defineComponent({
  // @Prop({ required: false, type: Object }) readonly data!: Record<string, any>;
  // @Prop({ required: false }) readonly rawitems!: any;
  // @Prop({ required: false }) readonly format!: any;
  name: 'MasterDetailedSettings',
  components: { DxDataGrid, DxHeaderFilter, JsonViewerCustom },
  props: {
    data: {
      type: Object,
      required: true,
    },
    rawitems: {
      type: Array,
      required: false,
    },
    format: {
      type: String,
      required: false,
    },
  },

  setup(props) {
    const customizedData: Ref<any> = ref({});
    const csvHeader: Ref<any> = ref([]);
    const columnsData = ref([]);
    const resizingModes = ref(['nextColumn', 'widget']);
    const currentMode = ref('nextColumn');



    onMounted(() => {
      console.log('props.rawitems', props.rawitems);
      console.log('props.data', props.data.data);
      if (props.rawitems) {
        if (Object.keys(props.data.length > 0)) {
          customizedData.value = props.rawitems[0];

        } else {
          customizedData.value = {};
        }
      } else {
        customizedData.value = props.data.data;
      }
      
      if (customizedData.value?.TableName) {
        customizedData.value['DatasetName'] = customizedData.value['TableName'];
        delete customizedData.value['TableName'];
      }
      if (Object.keys(customizedData.value).length > 0) {
        const blackList = [
          // 'UsersQuery',
          // 'UnixTime',
          // 'DatasetName',
          '0',
          '1',
          '2',
          '3',
          '4',
          'Archive',
          'rawindex',
          // 'requestParameters',
          // 'resources',
          // 'responseElements',
          // 'userIdentity'
          // 'S3Folders',
        ];
        let csvkeys = Object.keys(customizedData.value);
        // eslint-disable-next-line no-console
        // console.log("CSVKEYS", csvkeys);

        csvkeys.forEach((e1, idx, arr) => {
          if (blackList.includes(e1) || e1 === '1') {
            arr.splice(idx, 1);
          }
        });
        csvHeader.value = csvkeys;
        // csvkeys.map(({ '0','1','2','Archive', 'rawindex', ...rest }) => rest)
        //   // eslint-disable-next-line no-console
      }
      // // eslint-disable-next-line no-console
    });
    return {
      currentMode,
      resizingModes,
      csvHeader,
      customizedData,
      columnsData,
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
