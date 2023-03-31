<template>
  <DxTreeList
    id="employees"
    ref="treeList"
    :data-source="listFolder"
    :show-row-lines="true"
    :allow-column-reordering="true"
    :allow-column-resizing="true"
    :show-borders="true"
    :column-auto-width="true"
    key-expr="ID"
    parent-id-expr="IDH"
    @row-expanding="log"
    @selection-changed="onSelectionChanged"
  >
    <DxSelection :recursive="recursive" mode="multiple" />
    <DxColumn data-field="name" />
    <DxColumn data-field="BucketName" />
    <DxColumn data-field="Geography" caption="Geography" />
    <DxColumn data-field="Region" />
  </DxTreeList>
</template>

<script lang="ts">
import { DxColumn, DxSelection, DxTreeList } from 'devextreme-vue/tree-list';
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { DataCollectionService } from '~/services/api/data-collection-service';
import { DataCollectionModule } from '~/store/modules/data-collection';
import { isObject } from '~/utils/checkIsItObj';

@Component({
  name: 'TreeList',
  components: {
    DxTreeList,
    DxColumn,
    DxSelection,
  },
})
export default class TreeList extends Vue {
  @Prop({ required: true, type: Array }) readonly listFolder!: unknown[];
  public expandedRowKeys = [1, 2];
  public selectedRowKeys = [];
  public recursive = false;

  public onSelectionChanged(e: any): void {
    // eslint-disable-next-line no-console
    const currentSelectedRowKeys = e.currentSelectedRowKeys;
    const currentDeselectedRowKeys = e.currentDeselectedRowKeys;
    const allSelectedRowKeys = e.selectedRowKeys;
    const allSelectedRowsData = e.selectedRowsData;

    const selectedData = e.component.getSelectedRowsData('all');
    // eslint-disable-next-line no-console
    console.log(
      selectedData.map((item: any) => item.value),
      'selectedData',
    );
    DataCollectionModule.setFoldersPathHard(selectedData.map((item: any) => item.value));
    // eslint-disable-next-line no-console
    // console.log(currentSelectedRowKeys);
    // eslint-disable-next-line no-console
    // console.log(currentDeselectedRowKeys);
    // eslint-disable-next-line no-console
    // console.log(allSelectedRowKeys);
    // eslint-disable-next-line no-console
    // console.log(allSelectedRowsData);
  }

  public log({ component, key }: any): void {
    component.byKey(key).then(async (data: any) => {
      if (isObject(data.data)) {
        const awaitTofolder: string[] = Object.keys(data.data)
          .filter((item: string) => data.data[item] === '*')
          .map((it: string) => data.value + '/' + it);

        const response = (await DataCollectionService.getListFolders(awaitTofolder))
          .filter(it => it.status === 'fulfilled')
          .map((item: any) => item.value.data);

        DataCollectionModule.updateListFolders({ newRow: response, oldRow: data });
      }
    });
  }
}
</script>

<style module lang="scss"></style>
