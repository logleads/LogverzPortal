<template>
  <DxDataGrid
    id="gridContainer"
    ref="grid"
    :show-borders="true"
    :data-source="itemsRemastered"
    :show-column-lines="true"
    :show-row-lines="true"
    :allow-column-reordering="true"
    :column-auto-width="true"
    @toolbar-preparing="onToolbarPreparing"
  >
    <DxHeaderFilter :visible="true" />
    <DxFilterRow :visible="true" />
    <DxPaging :page-size="10" />
    // eslint-disable-next-line vue/no-v-for-template-key

    <template v-for="(v, k) in headers" :key="genereteRandomKey(k)">
      <DxColumn
        width="200px"
        :data-type="selectDateType(v)"
        :format="selectFormat(v)"
        :data-field="checks(v)"
      />
    </template>
    <DxMasterDetail :enabled="true" template="masterDetailedLoadSettings" />
    <template #masterDetailedLoadSettings="{ data }">
      <MasterDetailedSettings :data="data" :rawitems="rawitems" :format="getRolesForAllWindows" />
    </template>
    <DxExport :enabled="true" />
    <DxLoadPanel v-if="getCurrentKey === dataNumber" :enabled="true" />
    <DxScrolling mode="virtual" />
  </DxDataGrid>
</template>

<script lang="ts">
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.greenmist.css';

import { computed, ComputedRef, defineComponent, PropType, Ref, ref, watch } from 'vue';
import { exportDataGrid } from 'devextreme/excel_exporter';
import {
  DxColumn,
  DxDataGrid,
  DxExport,
  DxFilterRow,
  DxHeaderFilter,
  DxLoadPanel,
  DxMasterDetail,
  DxPaging,
  DxScrolling,
} from 'devextreme-vue/data-grid';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import MasterDetailedSettings from '~/components/create-query/load-settings/master-detailed-settings.vue';
import { QueryBuilderModule } from '~/store/modules/query-builder';

export default defineComponent({
  name: 'DataColumnComponent',
  components: {
    DxColumn,
    DxDataGrid,
    DxExport,
    DxFilterRow,
    DxLoadPanel,
    DxMasterDetail,
    MasterDetailedSettings,
    DxPaging,
    DxScrolling,
    DxHeaderFilter,
  },
  props: {
    headers: {
      type: Array as PropType<any>,
      required: true,
    },
    itemsRemastered: {
      type: Array as PropType<any>,
      required: true,
    },
    rawitems: {
      type: Array as PropType<any>,
      required: true,
    },
    curentKey: {
      type: Number,
      required: true,
    },
    dataNumber: {
      type: Number,
      required: true,
    },
  },
  // @Prop() readonly headers!: Array<unknown>;
  // @Prop() readonly itemsRemastered!: Array<unknown>;
  // @Prop() readonly rawitems!: Array<unknown>;
  // @Prop() readonly curentKey!: number;
  setup(props) {
    const grid: Ref<any> = ref(null);
    function selectWidth(data: string): string {
      return data.length > 30 ? '200px' : '100%';
    }

    function selectDateType(data: string): string | any {
      return data.includes('unixtime') ? 'date' : undefined;
    }

    function selectFormat(data: string): string | any {
      return data.includes('unixtime') ? 'shortDateShortTime' : undefined;
    }

    function checks(v: string): any {
      if (v === '0') {
        return 'test1' + Math.random();
      }
      if (v.includes('unixtime')) {
        parseInt(v);
      }
      return v ?? 'test2' + Math.random();
    }

    function genereteRandomKey(obj: unknown): string {
      return Number.isNaN(obj) ? Math.random() + '' : (obj as string) + Math.random() * 10000;
    }

    const togglingExport: ComputedRef<boolean> = computed(() => {
      return QueryBuilderModule.dataForAllWindows[props.dataNumber as number]
        ? QueryBuilderModule.dataForAllWindows[props.dataNumber as number].togglingExport
        : false;
    });
    const getCurrentKey: ComputedRef<Nullable<number>> = computed(() => {
      return QueryBuilderModule.key;
    });

    const dataBaseCurrentAlias: ComputedRef<string> = computed(() => {
      return QueryBuilderModule.dataForAllWindows[props.dataNumber as number]
        ? QueryBuilderModule.dataForAllWindows[props.dataNumber as number].dataBaseCurrentAlias
        : '';
    });

    const currentAvailableTable: ComputedRef<string> = computed(() => {
      return QueryBuilderModule.dataForAllWindows[props.dataNumber as number]
        ? QueryBuilderModule.dataForAllWindows[props.dataNumber as number].currentAvailableTable
        : '';
    });

    const getRolesForAllWindows: ComputedRef<string> = computed(() => {
      return QueryBuilderModule.dataForAllWindows[props.dataNumber as number]
        ? QueryBuilderModule.dataForAllWindows[props.dataNumber as number].tableDataFormat
        : null;
    });

    watch(togglingExport, () => {
      // eslint-disable-next-line no-console
      // console.log('handleExporting1');
      exportData();
    });

    function exportData(): void {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(
        `${dataBaseCurrentAlias.value} ${currentAvailableTable.value}`,
      );
      const gridInstance = grid.value?.$_instance;
      exportDataGrid({
        component: gridInstance,
        worksheet: worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx
          .writeBuffer()
          .then((buffer: BufferSource) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
          })
          .catch((e: any): void => {
            // eslint-disable-next-line no-console
            console.log(e);
          });
      });
    }

    function onToolbarPreparing(e: { toolbarOptions: { items: Array<{ name: string }> } }): void {
      e.toolbarOptions.items = e.toolbarOptions.items.filter(i => i.name !== 'exportButton');
    }
    return {
      onToolbarPreparing,
      exportData,
      getRolesForAllWindows,
      currentAvailableTable,
      dataBaseCurrentAlias,
      togglingExport,
      genereteRandomKey,
      checks,
      selectFormat,
      selectDateType,
      selectWidth,
      grid,
      getCurrentKey,
    };
  },
});
</script>

<style>
#gridContainer {
  height: 100%;
  width: 100%;
}
</style>
