<template>
  <DxTreeList
    id="employees"
    ref="treeList"
    :data-source="listFolder"
    :show-row-lines="true"
    height="800"
    :allow-column-reordering="true"
    :allow-column-resizing="true"
    :show-borders="true"
    :column-auto-width="true"
    key-expr="ID"
    parent-id-expr="IDH"
    @row-expanding="log"
    @selection-changed="onSelectionChanged"
  >
    <DxScrolling mode="standard" />
    <!-- or "virtual" | "infinite" -->
    <DxSelection :recursive="recursive" mode="multiple" />
    <DxColumn data-field="name" />
    <DxColumn data-field="BucketName" />
    <DxColumn data-field="Geography" caption="Geography" />
    <DxColumn data-field="Region" />
  </DxTreeList>
</template>

<script lang="ts">
import { DxColumn, DxScrolling, DxSelection, DxTreeList } from 'devextreme-vue/tree-list';
import { defineComponent, ref } from 'vue';

import { DataCollectionService } from '~/services/api/data-collection-service';
import { DataCollectionModule } from '~/store/modules/data-collection';
import { isObject } from '~/utils/checkIsItObj';

export default defineComponent({
  name: 'TreeList',
  components: {
    DxTreeList,
    DxColumn,
    DxSelection,
    DxScrolling,
  },
  props: {
    listFolder: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const expandedRowKeys = ref([1, 2]);
    const selectedRowKeys = ref([]);
    const recursive = ref(false);

    function onSelectionChanged(e: any): void {
      const selectedData = e.component.getSelectedRowsData('all');
      console.log(
        selectedData?.map((item: any) => item.value),
        'selectedData',
      );
      DataCollectionModule.setFoldersPathHard(selectedData?.map((item: any) => item.value));
    }

    function log({ component, key }: any): void {
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

    return {
      log,
      onSelectionChanged,
      recursive,
      selectedRowKeys,
      expandedRowKeys,
    };
  },
});
</script>

<style scoped>
.tree-list-container {
  width: 100%;
  overflow-y: auto;
  /* Enable horizontal scrolling if content overflows */
  height: 500px;
  font-family: 'Roboto', sans-serif !important;
}
:deep(.dx-treelist) {
  font-family: 'Roboto', sans-serif !important;
  color: var(--ink-color) !important;
}

/* Or target specific elements */
:deep(.dx-treelist-headers) {
  font-family: 'Roboto', sans-serif !important;
  color: var(--ink-color) !important;
}

:deep(.dx-treelist-rowsview) {
  font-family: 'Roboto', sans-serif !important;
  color: var(--ink-color) !important;
}

:global(.dx-virtual-row) {
  display: none !important;
}
</style>
