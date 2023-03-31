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
        />
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
import { DxDataGrid } from 'devextreme-vue/data-grid';
import { Component, Prop, Vue } from 'vue-property-decorator';

import Icon from '~/components/shared/icon.vue';
import Loader from '~/components/shared/loader.vue';
import ParseObject from '~/components/shared/parseObject.vue';

@Component({
  name: 'MasterDetailedSettings',
  components: { ParseObject, Loader, Icon, DxDataGrid },
})
export default class MasterDetailedSettings extends Vue {
  @Prop({ required: false, type: Object }) readonly data!: Record<string, any>;
  @Prop({ required: false }) readonly rawitems!: any;
  @Prop({ required: false }) readonly format!: any;
  public customizedData!: any;
  public csvHeader: any = [];
  public columnsData = [];
  public resizingModes = ['nextColumn', 'widget'];
  public currentMode = 'nextColumn';
  created(): void {
    // eslint-disable-next-line no-console
    // console.log('data IS', this.rawitems);
    if (this.rawitems) {
      if (Object.keys(this.data.data.length > 0)) {
        // // eslint-disable-next-line no-console
        // console.log('ease', this.data.data);
        this.customizedData = this.rawitems[this.data.data.rawindex];
        
      } else {
        this.customizedData = {};
      }
    } else {
      this.customizedData = this.data.data;
    }
    if(this.customizedData['TableName']){
          this.customizedData['DatasetName'] = this.customizedData['TableName'];
          delete this.customizedData['TableName'];
          // const tableNameIndex = this.customizedData.indexof(this.customizedData['TableName']);
          // if(tableNameIndex > -1){

          //   this.customizedData.splice(tableNameIndex, 1);
          // }
    }
    if (Object.keys(this.customizedData).length > 0) {
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
        // 'S3Folders',
      ];
      let csvkeys = Object.keys(this.customizedData);
      // eslint-disable-next-line no-console
      // console.log("CSVKEYS", csvkeys);
      csvkeys.forEach((e1, idx, arr) => {
        
        if (blackList.includes(e1) || e1 === '1') {
          arr.splice(idx, 1);
        }
        
      });
      this.csvHeader = csvkeys;
      // csvkeys.map(({ '0','1','2','Archive', 'rawindex', ...rest }) => rest)
      // eslint-disable-next-line no-console
      console.log("CSV header: " , this.csvHeader)
    }
    // eslint-disable-next-line no-console
    console.log('customizedData', this.customizedData);
  }
}
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
