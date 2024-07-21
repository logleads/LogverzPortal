<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <DxDataGrid
    ref="DataGrid"
    :show-borders="true"
    :data-source="searce"
    :show-column-lines="true"
    :show-row-lines="true"
    :allow-column-reordering="true"
    :column-auto-width="true"
    :on-editor-prepared="onEditorPrepared"
  >
    <DxHeaderFilter :visible="true" />
    <DxFilterRow :visible="true" />
    <DxColumn caption="Action" data-field="Action" />
    <DxColumn caption="Category" data-field="Category" :width="100" />
    <DxColumn caption="Severity" data-field="Severity" :width="100" />
    <DxColumn
      caption="Time"
      data-field="tm"
      format="dd/MM/yyyy"
      cell-template="cellTemplate"
      :width="300"
    />
    <template #cellTemplate="{ data }">
      <TimeFields
        :UnixTimeNormalFormat="data.data.UnixTimeNormalFormat"
        :TimeLocalFormat="data.data.TimeLocalFormat"
      />
    </template>
    <DxColumn caption="Message" data-field="message" />
    <DxColumn caption="Source" data-field="source" />
    <DxMasterDetail :enabled="true" template="masterDetailedLoadSettings" />
    <template #masterDetailedLoadSettings="{ data }">
      <MasterDetailedSettings :data="data" />
    </template>
  </DxDataGrid>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import {
  DxColumn,
  DxDataGrid,
  DxFilterRow,
  DxHeaderFilter,
  DxMasterDetail,
} from 'devextreme-vue/data-grid';

import MasterDetailedSettings from '~/components/create-query/load-settings/master-detailed-settings.vue';
import TimeFields from '~/components/shared/time-fields.vue';

export default defineComponent({
  name: 'EventTable',
  components: {
    MasterDetailedSettings,

    DxColumn,
    DxDataGrid,
    DxHeaderFilter,
    DxFilterRow,
    DxMasterDetail,
    TimeFields,
  },
  props: {
    searce: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const DataGrid: any = ref<HTMLElement | null>(null);
    function onEditorPrepared() {
      // eslint-disable-next-line no-console
      // console.log(e,'ff')
      // if (e.dataField == 'tm' && e.parentType == 'filterRow') {
      //   // eslint-disable-next-line no-console
      //   console.log(this.$refs.DataGrid)
      //   // eslint-disable-next-line no-console
      //   // console.log(e.editorElement);
      //   // e.editorElement.dxDateBox('instance').option('format', 'datetime');
      //   // e.editorElement.dxDateBox('instance').option('onValueChanged', function (options: any) {
      //   //   e.setValue(options.value);
      //   // });
      // }
    }
    return {
      DataGrid,
      onEditorPrepared,
    };
  },
});
</script>
