<template>
  <div>
    <DxTreeList id="employees" ref="treeList" :data-source="listAzureFolder" :show-row-lines="true" height="800"
      :allow-column-reordering="true" :allow-column-resizing="true" :show-borders="true" :column-auto-width="true"
      key-expr="ID" parent-id-expr="IDH" items-expr="data" data-structure="tree" @row-expanding="log"
    @selection-changed="onSelectionChanged"
      >
      <DxScrolling mode="standard" />
      <DxSelection :recursive="false" mode="multiple" />

      <DxColumn data-field="ContainerName" caption="Container Name" />
      <DxColumn data-field="StorageAccount" caption="Storage Account" />
      <DxColumn data-field="Location" caption="Location" />
    </DxTreeList>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { DxColumn, DxScrolling, DxSelection, DxTreeList } from 'devextreme-vue/tree-list';
import { DataCollectionModule } from '~/store/modules/data-collection';
import { DataCollectionService } from '~/services/api/data-collection-service';

export default defineComponent({
  components: {
    DxTreeList,
    DxColumn,
    DxSelection,
    DxScrolling,
  },
  props: {
    listAzureFolder: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    function findNodeByID(tree: any[], id: number): any | null {
      for (const node of tree) {
        if (node.ID === id) return node;
        if (node.data && node.data.length) {
          const found = findNodeByID(node.data, id);
          if (found) return found;
        }
      }
      return null;
    }


    async function log({ component, key }: any) {
      try {
        const treeData = props.listAzureFolder; // or wherever your tree data is stored
        const expandedNode = findNodeByID(treeData, key);

        if (!expandedNode) return;
        const folderPathObject = expandedNode.data.map((child: any) => {
          const fullPath = findNodeWithParents(treeData, child.ID);
          const parts = fullPath.map((n: any) => n.ContainerName).filter(Boolean);
          return `blob://${parts.join('/')}/`;
        });
        console.log("calll-0");
        
          const result = await DataCollectionService.getAzureListFolders(folderPathObject);
          DataCollectionModule.updateAzureListFolders({ newRow: result.data, oldRow: expandedNode });

      } catch (err) {
        console.error("Error expanding Azure node:", err);
      }
    }


        function onSelectionChanged(e: any): void {
          const selectedData = e.component.getSelectedRowsData('all');
          
          DataCollectionModule.setBlobFoldersPathHard(selectedData?.map((item: any) => item.fullPath));
        }


    function findNodeWithParents(tree: any[], targetId: number): any[] {
      function helper(nodes: any[], path: any[] = []): any[] | null {
        for (const node of nodes) {
          const newPath = [...path, node];
          if (node.ID === targetId) return newPath;
          if (node.data && node.data.length) {
            const result = helper(node.data, newPath);
            if (result) return result;
          }
        }
        return null;
      }

      return helper(tree) || [];
    }

    return {
      onSelectionChanged,
      log,

    };
  }
});
</script>

<style scoped>
.tree-list-container {
  width: 100%;
  overflow-y: auto;
  height: 500px;
  font-family: 'Roboto', sans-serif !important;
}

:deep(.dx-treelist) {
  font-family: 'Roboto', sans-serif !important;
  color: var(--ink-color) !important;
}

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
