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
import { DxColumn,DxDataGrid } from 'devextreme-vue/data-grid';
import { Component, Prop, Vue } from 'vue-property-decorator';

import Icon from '~/components/shared/icon.vue';
import Loader from '~/components/shared/loader.vue';
import ParseObject from '~/components/shared/parseObject.vue';

@Component({
  name: 'MasterDetailedLoadSettings',
  components: { ParseObject, Loader, Icon, DxDataGrid,DxColumn },
})
export default class MasterDetailedLoadSettings extends Vue {
  @Prop({ required: false, type: Object }) readonly data!: Record<string, any>;
  @Prop({ required: false }) readonly format!: any;
  public customizedData!: any;
  public csvHeader: any = [];
  public columnsData = [];
  public resizingModes = ['nextColumn', 'widget'];
  public currentMode = 'nextColumn';
  created(): void {
    // eslint-disable-next-line no-console
    // console.log('data IS', this.rawitems);
    
      this.customizedData = this.data.data;
    
    if (Object.keys(this.customizedData).length > 0) {
      const blackList = [
        'UsersQuery',
        'UnixTime',
        // 'DatasetName',
        '0',
        '1',
        'rawindex',
        'S3Folders',
      ];
      let csvkeys = Object.keys(this.customizedData);
      this.csvHeader = csvkeys.forEach((e1, idx, arr) => {
        if (blackList.includes(e1)) {
          arr.splice(idx, 1);
        }
      });
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
