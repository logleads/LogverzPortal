<template>
  <div :class="$style['popup']" @click="handleShowForm($event, false)">
    <div :class="$style['popup__body']" @click="handleBodyClick($event)">
      <div :class="$style['table']">
        <label :class="$style['range-label']"><b> Range</b>:</label>
        <TimerFilter @clear="clear" @unix-time-change="timeFilter" />

        <Tabs btn-rigth-text="Shared" btn-left-text="My" :state-b-t-n="tableMode" text-before-btn="Scope"
          @change-table-content="changeTableMode" />
        <Tabs btn-rigth-text="All" btn-left-text="Current" text-before-btn="Version" :state-b-t-n="filterContent"
          @change-table-content="applyVersionFilter" />
        <div :class="$style['tooltip-margin']">
          <ToolTip :tip="DCH_QUERY_HISTORY_local" />
        </div>
      </div>

      <div :class="$style['table-h']">
        <Loader v-if="isSettingsFetch" accent />
        <DxDataGrid v-else id="gridSettings" :show-borders="true" :data-source="tableData" :show-column-lines="true"
          :show-row-lines="true" :allow-column-reordering="true" :column-auto-width="true">
          <DxHeaderFilter :visible="true" />
          <DxFilterRow :visible="true" />

          <!-- Action Column with a custom button -->
          <!-- <DxColumn type="buttons" :width="150" caption="Action" data-field="id">
            <template #cellTemplate="{ data }" >
              <DxButton >
                <SimpleBtn btn-text="Load configuration" @clicked.stop="loadConfiguration(data, $event)" />
              </DxButton>
            </template>
</DxColumn> -->
          <DxColumn type="buttons" :width="150" caption="Action" data-field="id" cell-template="cellTemplate" />
          <!-- Using Vue's template for custom cell content -->

          <template #cellTemplate="{ data }">
            <!-- Directly use SimpleBtn or a native button for custom actions -->
            <SimpleBtn btn-text="Load configuration" @clicked.stop="loadConfiguration(data, $event)" />
          </template>

          <!-- </DxColumn> -->

          <!-- Creator Column -->
          <DxColumn caption="Creator" data-field="UsersQuery" />

          <!-- Time Column with custom cell content -->
          <DxColumn caption="Time" data-field="UnixTimeNormalFormat" cell-template="TimeFields" />
          <template #TimeFields="{ data }">
            <TimeFields :unix-time-nomal-format="data.UnixTimeNormalFormat" :time-local-format="data.TimeLocalFormat" />
          </template>
          <!-- </DxColumn> -->

          <!-- Other Columns -->
          <DxColumn caption="Dataset Name" data-field="DatasetName" />
          <DxColumn caption="Description" data-field="Description" />
          <DxColumn caption="Source" data-field="S3Folders" />

          <!-- Master Detail Template -->
          <DxMasterDetail :enabled="true">
            <template #template="{ data }">
              <MasterDetailedSettings :data="data" />
            </template>
          </DxMasterDetail>
        </DxDataGrid>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'devextreme/dist/css/dx.light.css';

import DxDataGrid, {
  DxButton,
  DxColumn,
  DxFilterRow,
  DxHeaderFilter,
  DxMasterDetail,
} from 'devextreme-vue/data-grid';
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref, watch } from 'vue';

import SimpleBtn from '~/components/shared/btn-simple.vue';
import Loader from '~/components/shared/loader.vue';
import Tabs from '~/components/shared/tabs.vue';
import TimeFields from '~/components/shared/time-fields.vue';
import TimerFilter from '~/components/shared/time-filter.vue';
import ToolTip from '~/components/shared/tool-tip.vue';
import { DCH_QUERY_HISTORY } from '~/constants';
import { DataCollectionModule } from '~/store/modules/data-collection';
import { parseObj } from '~/utils/destructObject';
import { parseFormatTimeUTS } from '~/utils/parsTimeUTC';

import MasterDetailedSettings from './master-detailed-settings.vue';

export default defineComponent({
  name: 'LoadSettings',
  components: {
    MasterDetailedSettings,
    Loader,
    DxColumn,
    DxButton,
    DxDataGrid,
    DxFilterRow,
    DxHeaderFilter,
    DxMasterDetail,
    TimerFilter,
    Tabs,
    TimeFields,
    SimpleBtn,
    ToolTip,
  },
  setup(props, { emit }) {
    const reuseDatasetName: Ref<boolean> = ref(false);
    const tableMode: Ref<boolean> = ref(true);
    const filterContent: Ref<boolean> = ref(false);
    const DCH_QUERY_HISTORY_local = ref(DCH_QUERY_HISTORY);
    const unix: Ref<number> = ref(1662377932723);
    const tableData = ref([]);

    onMounted(async () => {
      changeTableMode(true);
    });

    const savedSettings: ComputedRef<any> = computed(() => {
      let response = DataCollectionModule.savedSettings?.map(i => {
        const obj = parseObj(i);
        //delete obj.DataType;
        return {
          ...obj,
          UnixTimeNormalFormat: parseFormatTimeUTS(obj.UnixTime).utcTime,
          TimeLocalFormat: parseFormatTimeUTS(obj.UnixTime).localTime,
          Owners: i.Owners?.length ? i.Owners.join(' ') : '',
          Access: i.Access?.length ? i.Access.join(' ') : '',
        };
      });
      return response;
    });

    watch(savedSettings, (value: any) => {
      const filteredData = implementActiveFIlter(value);
      // return filteredData;
      let modifyData = FIxTableNameToDatasetName(filteredData);
      // tableData.value = modifyData;
    });

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    function FIxTableNameToDatasetName(data: any) {

      return data.length > 0 ? data?.map((filtered: any) => {
        if (filtered['TableName']) {
          filtered['DatasetName'] = filtered['TableName'];
          delete filtered['TableName'];
        }
        return filtered;
      }) : [];
    }

    function changeTableMode(value: boolean): void {
      tableMode.value = value;
      DataCollectionModule.getSettings({ typeQuery: !tableMode.value, unixTime: unix.value });
    }

    function applyVersionFilter(value: boolean): void {
      // TODO: this;
      filterContent.value = value;
      if (value) {
        const data = implementActiveFIlter(tableData.value);
        tableData.value = data ? FIxTableNameToDatasetName(data) : [];
      } else {
        tableData.value = FIxTableNameToDatasetName(savedSettings);
      }
    }

    const isSettingsFetch: ComputedRef<boolean> = computed(() => {
      return DataCollectionModule.isSettingsFetch;
    });

    function implementActiveFIlter(data: any[]): any {
      // let list = JSON.parse(JSON.stringify(data));
      if (filterContent.value) {
        let result = data.filter((item: any) => item.Active === true);
        return result;
      } else {
        return data;
      }
    }

    function handleShowForm(e: Event, value: boolean): void {
      e.stopPropagation();
      emit('toggleForm', value);
    }

    function handleBodyClick(e: Event): void {
      e.stopPropagation();
    }

    function loadConfiguration(
      {
        data,
      }: {
        data: {
          S3Folders: string;
          DatabaseName: string;
          DataType: string;
          QueryString: string;
          DatasetName: string;
          Description: string;
          UsersQuery: string;
          Owners: string;
          Access: string;
        };
      },
      e: Event,
    ): void {
      // eslint-disable-next-line no-console
      console.log('LOADED', data);
      // if(data.TableName)
      DataCollectionModule.loadConfiguration({
        ...data,
        DatasetWarnings:
          'The specified dataset name already exists, rename dataset if you wish to avoid overwriting ALL data',
      });
      // DataCollectionModule.isLoadConfigurationUpload(false);
      // ErrorsModule.showWarningMessage('The specified dataset name already exists, rename dataset if you wish to avoid overwriting ALL data');

      handleShowForm(e, false);
    }

    function timeFilter(unixParam: number): void {
      unix.value = unixParam;
      DataCollectionModule.getSettingsSortByTime({
        unixTime: unixParam,
        typeQuery: !tableMode.value,
      });
    }

    function clear(): void {
      // DataCollectionModule.getSettings(!this.tableMode, this.unix);
    }
    function cellRenderer({ data }) {
      console.log("data=======", data);

      return {
        render(createElement) {
          return createElement(SimpleBtn, {
            props: {
              btnText: "Load configuration",
              rowData: data
            },
            on: {
              clicked: (event) => loadConfiguration(data, event)
            }
          });
        }
      };
    }

    return {
      cellRenderer,
      clear,
      timeFilter,
      loadConfiguration,
      handleBodyClick,
      handleShowForm,
      implementActiveFIlter,
      isSettingsFetch,
      applyVersionFilter,
      changeTableMode,
      FIxTableNameToDatasetName,
      savedSettings,
      reuseDatasetName,
      tableMode,
      filterContent,
      DCH_QUERY_HISTORY_local,
      unix,
      tableData,
    };
  },
});
</script>

<style module lang="scss">
.btn {
  background-color: white;
  color: var(--accent-color);
  width: 140px;
  height: 45px;
  border: 1px solid var(--accent-color);
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s linear;

  &:hover {
    background-color: var(--accent-color);
    color: #fff;
    transition: all 0.3s linear;
  }
}

.btn-place {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.popup {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background-color: rgba(43, 42, 44, 0.4);
  z-index: 3;

  &__body {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: 60%;
    background-color: white;
    min-height: 500px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }
}

.additional-settings {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 90%;
  margin: 20px 0 20px 76px;

  &__checkbox {
    margin-right: 20px;
  }

  &__label {
    font-weight: 500;
    font-size: 15px;
    color: var(--ink-color);
  }
}

.range-label {
  margin-top: 6px;
  padding-top: 4px;
  padding-left: 4px;
}

.table {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  margin: 15px 0;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    height: 73px;
    padding-left: 24.5px;
    font-weight: 500;
    font-size: 14px;
    color: var(--blue-text-color);

    >div {
      display: flex;
      align-items: center;
      // padding-right: 19px;
    }
  }
}

.table-h {
  height: 85%;
  width: 95%;
}

.tooltip-margin {
  margin-top: 6px;
}
</style>
<style>
#gridSettings {
  max-width: 100%;
  height: 100%;
}
</style>
