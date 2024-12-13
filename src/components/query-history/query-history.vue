<template>
  <div :class="$style['table-query-history']">
    <!-- <div > -->

    <!-- </div> -->
    <div :class="$style['table']">
      <label :class="$style['range-label']"><b> Range</b>:</label>
      <TimerFilter @clear="clear" @unix-time-change="timeFilter" />
      <CollectionTypes @collection-filter-change="changeTableContent" />
      <!-- <div :class="$style['tab-padding']">
        <Tabs btn-rigth-text="Collection" btn-left-text="Analysis" text-before-btn="Type" :state-b-t-n="tableContent"
          @change-table-content="changeTableContent" />
      </div> -->
      <div :class="$style['tab-padding']">
        <Tabs btn-rigth-text="Shared" btn-left-text="My" :state-b-t-n="tableMode" text-before-btn="Scope"
          @change-table-content="changeTableMode" />
      </div>
      <div :class="$style['tab-padding']">
        <Tabs btn-rigth-text="All" btn-left-text="Current" text-before-btn="Version" :state-b-t-n="filterContent"
          @change-table-content="applyVersionFilter" />
      </div>

      <div :class="$style['tooltip-margin']">
        <ToolTip :tip="local_DCH_QUERY_HISTORY" />
      </div>
    </div>
    <template v-if="isSettingsFetch">
      <Loader accent />
    </template>
    <template v-else>
      <DxDataGrid id="gridSettings" :show-borders="true" :data-source="savedSettingOrigin" :show-column-lines="true"
        :show-row-lines="true" :allow-column-reordering="true" :column-auto-width="true" :word-wrap-enabled="true">
        <DxHeaderFilter :visible="true" />
        <DxFilterRow :visible="true" />

        <DxColumn type="buttons" caption="Actions" data-field="id" cell-template="cellTemplate" />
        <DxButton v-if="tableContent === 'A'">
          <template #cellTemplate="{ data }">
            <pre>{{ data }}</pre>
            <div v-if="data && data.Active === false" width="150">
              {{ console.log("dadkahdlakjhd") }}
              <div :class="$style['text-1']">Underlying data was deleted</div>
              <div :class="$style['text-2']">or have been overwritten</div>
            </div>
            <!-- <SimpleBtn
              :disable="exportV"
              btn-text="Load configuration"
              @clicked.stop="loadConfiguration(data)"
            /> -->
          </template>
        </DxButton>
        <!-- <DxButton> -->
        <template #cellTemplate="{ data }">
          <!-- <pre>{{ data }}</pre> -->
          <SimpleBtn v-if="tableContent === 'A'" :disable="exportV" btn-text="Load configuration"
            @clicked.stop="loadConfiguration(data)" />
          <SimpleBtn v-if="data && !data.displayButton" btn-text="Change Permissions"
            @clicked.stop="openChangePermissionModal(data)" />

          <SimpleBtn v-if="data && !data.displayButton" btn-text="Delete Record"
            @clicked.stop="openDeleteRecordModal(data)" />
          <div v-else>
            <span>No data available</span>
          </div>
        </template>
        <!-- </DxButton> -->
        <!-- <DxButton>
          <template #cellTemplate="{ row = {} }">
            <pre>{{ row.data }}</pre>
            <SimpleBtn v-if="row.data && row.data.displayButton" btn-text="Delete Record"
              @clicked.stop="openDeleteRecordModal(row.data)" />
            <div v-else>
              <span>No data available 3</span>
            </div>
          </template>
        </DxButton> -->

        <DxColumn caption="Creator" data-field="UsersQuery" />
        <DxColumn caption="UnixTime" data-field="tm" format="dd/MM/yyyy" cell-template="span" :width="200" />
        <template #span="{ data = {} }">
          <p :class="$style['tooltip']">
            UTC time: {{ data.UnixTimeNormalFormat }}
            <span :class="$style['tooltip_tooltiptext']">Local time: {{ data.TimeLocalFormat || '...' }}</span>
          </p>
        </template>
        <DxColumn caption="DatasetName" data-field="TableName" :width="150" :allow-sorting="false" />
        <DxColumn caption="Owners" data-field="displayOwners" :width="150" :allow-sorting="false" />
        <DxColumn caption="Access" data-field="displayAccess" :width="200" :allow-sorting="false" />
        <DxColumn caption="Database Name" data-field="DatabaseName" />

        <DxMasterDetail :enabled="true" template="queryHistorySettings" />
        <template #queryHistorySettings="{ data = {} }">
          <QueryHistorySettings :data="data" />
        </template>
      </DxDataGrid>
    </template>

    <QueryHistoryPermission v-if="isOpenPermissionDialog" :is-analysis="tableContent === 'A'"
      @closePermissionPopup="handleClosePermissionPopup" />
    <QueryHistoryDeleteRecord @closePermissionPopup="handleClosePermissionPopup" />
  </div>
</template>

<script lang="ts">
import 'devextreme/dist/css/dx.light.css';

import {
  DxButton,
  DxColumn,
  DxDataGrid,
  DxFilterRow,
  DxHeaderFilter,
  DxMasterDetail,
} from 'devextreme-vue/data-grid';
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref } from 'vue';

import QueryHistoryDeleteRecord from '~/components/query-history/query-dialog-delete-record.vue';
import QueryHistoryPermission from '~/components/query-history/query-dialog-save-permission.vue';
import QueryHistorySettings from '~/components/query-history/query-history-settings.vue';
import SimpleBtn from '~/components/shared/btn-simple.vue';
import CollectionTypes from '~/components/shared/collection-types.vue';
import Loader from '~/components/shared/loader.vue';
import Tabs from '~/components/shared/tabs.vue';
import TimerFilter from '~/components/shared/time-filter.vue';
import ToolTip from '~/components/shared/tool-tip.vue';
import { DCH_QUERY_HISTORY } from '~/constants';
import { QueryHistoryService } from '~/services/api/query-history-service';
import { AdminModule } from '~/store/modules/admin';
import { DataCollectionModule } from '~/store/modules/data-collection';
import { ErrorsModule } from '~/store/modules/errors';
import { SaveSettingModule } from '~/store/modules/save-setting';
import { PermissionsTypes } from '~/types/models/admin-window-types';
import { parseObj } from '~/utils/destructObject';
import { parseFormatTimeUTS } from '~/utils/parsTimeUTC';
import { checkPermissionForDisplayPermissions } from '~/utils/queryHistoryHelper';

export default defineComponent({
  name: 'QueryHistory',
  components: {
    QueryHistorySettings,
    QueryHistoryPermission,
    QueryHistoryDeleteRecord,
    Loader,
    DxColumn,
    DxButton,
    DxDataGrid,
    DxHeaderFilter,
    DxFilterRow,
    CollectionTypes,
    DxMasterDetail,
    Tabs,
    TimerFilter,
    SimpleBtn,
    ToolTip,
  },
  setup() {
    const reuseTableName: Ref<boolean> = ref(false);
    const tableMode: Ref<boolean> = ref(true);
    const tableContent: Ref<string> = ref('C');
    const filterContent: Ref<boolean> = ref(true);
    const isSettingsFetch: Ref<boolean> = ref(false);
    const savedSettingsQH: Ref<Array<any>> = ref([]);
    const savedSettingOrigin: Ref<Array<any>> = ref([]);
    const backupSavedSettingsQH: Ref<Array<any>> = ref([]);
    const backupSavedSettingOrigin: Ref<Array<any>> = ref([]);

    // or your initial data

    const unix: Ref<number> = ref(0);
    const local_DCH_QUERY_HISTORY = ref(DCH_QUERY_HISTORY);
    const usersPermission: Ref<PermissionsTypes> = ref({
      Admin: false,
      LisaPowerUsers: false,
      LisaUsers: false,
      UserName: '',
    });
    onMounted(async () => {
      DataCollectionModule.getDatasetAccessParameters();
    });

    const AdminPermissions: ComputedRef<any> = computed(() => {
      return AdminModule.permissions;
    });
    function parseQueryTipe(shortName: string) {
      return shortName == 'A' ? 'Analysis' : 'Collection';
    }
    function deepCloneWithoutCircularReferences(obj, hash = new WeakMap()) {
      console.log('obj', obj);

      if (Object(obj) !== obj) return obj; // If not an object, return itself
      if (hash.has(obj)) return hash.get(obj); // If circular reference, return the cache
      const result = Array.isArray(obj) ? [] : {};
      hash.set(obj, result);
      Object.keys(obj).forEach(key => {
        result[key] = deepCloneWithoutCircularReferences(obj[key], hash);
      });
      return result;
    }

    function transformSavedSettings(data: Array<any>): Array<any> {
      return data.map(i => {
        const obj = parseObj(i);
        return {
          ...obj,
          UnixTimeNormalFormat: parseFormatTimeUTS(obj.UnixTime).utcTime,
          TimeLocalFormat: parseFormatTimeUTS(obj.UnixTime).localTime,
          DataType: parseQueryTipe(obj.QueryTipe),
          tm: new Date(obj.UnixTime),
        };
      });
    }

    function transformSettings(data: any): Array<any> {
      // eslint-disable-next-line no-console
      // console.log('DEEE', data);
      const resp = data.map((i: any) => {
        return {
          ...i,
          UnixTimeNormalFormat: parseFormatTimeUTS(i.UnixTime).utcTime,
          TimeLocalFormat: parseFormatTimeUTS(i.UnixTime).localTime,
          DataType: parseQueryTipe(i.QueryTipe),
          tm: new Date(i.UnixTime),
          displayButton: checkPermissionForDisplayPermissions(AdminPermissions.value, i),
          displayOwners: i.Owners?.length ? i.Owners.join(' ') : '',
          displayAccess: i.Access?.length ? i.Access.join(' ') : '',
        };
      });

      // eslint-disable-next-line no-console
      console.log('Response time', resp);
      return resp;
    }

    async function changeTableMode(value: boolean): Promise<void> {
      tableMode.value = value;
      isSettingsFetch.value = true;

      try {
        const data = await QueryHistoryService.getSettingsSortByTime(
          AdminModule.permissions.UserName,
          unix.value,
          tableContent.value,
          !tableMode.value,
        );
        console.log('Tab', transformSettings(data));
        backupSavedSettingOrigin.value = transformSettings(data);
        backupSavedSettingsQH.value = transformSavedSettings(data);
        savedSettingOrigin.value = implementActiveFIlter(transformSettings(data));
        savedSettingsQH.value = implementActiveFIlter(transformSavedSettings(data));
      } catch (e: any) {
        ErrorsModule.showErrorMessage(e.message);
      }
      isSettingsFetch.value = false;
    }

    function loadConfiguration(data: any): void {
      SaveSettingModule.loadSetting(data.QuerySettings);
    }

    function getSavedSettingOrigin(rowIndex: any): any {
      return savedSettingOrigin.value[rowIndex].QuerySettings;
    }
    function applyVersionFilter(value: boolean): void {
      // TODO: this;
      filterContent.value = value;
      if (value) {
        savedSettingOrigin.value = implementActiveFIlter(savedSettingOrigin.value);
        savedSettingsQH.value = implementActiveFIlter(savedSettingsQH.value);
      } else {
        savedSettingOrigin.value = backupSavedSettingOrigin.value;
        savedSettingsQH.value = backupSavedSettingsQH.value;
      }
    }
    function implementActiveFIlter(data: any[]): any {
      // let list=JSON.parse(JSON.stringify(data))

      let list = data;
      if (filterContent.value) {
        let result = list.filter((item: any) => item.Active === true);
        return result;
      } else {
        return list;
      }
    }
    async function changeTableContent(value: string): Promise<void> {
      console.log('change table content', value);
      tableContent.value = value;
      isSettingsFetch.value = true;

      try {
        const data = await QueryHistoryService.getSettingsSortByTime(
          AdminModule.permissions.UserName,
          unix.value,
          tableContent.value,
          !tableMode.value,
        );

        // this.savedSettingOrigin = this.transformSettings(data);
        // this.savedSettingsQH = this.transformSavedSettings(data);
        backupSavedSettingOrigin.value = transformSettings(data);
        backupSavedSettingsQH.value = transformSavedSettings(data);
        savedSettingOrigin.value = implementActiveFIlter(transformSettings(data));
        savedSettingsQH.value = implementActiveFIlter(transformSavedSettings(data));
      } catch (e: any) {
        ErrorsModule.showErrorMessage(e.message);
      }
      isSettingsFetch.value = false;
    }

    async function clear(): Promise<void> {
      isSettingsFetch.value = true;
      try {
        const data = await QueryHistoryService.getSettings(
          AdminModule.permissions.UserName,
          unix.value,
          tableContent.value,
          !tableMode.value,
        );
        // this.savedSettingOrigin = this.transformSettings(data);
        // this.savedSettingsQH = this.transformSavedSettings(data);
        backupSavedSettingOrigin.value = transformSettings(data);
        backupSavedSettingsQH.value = transformSavedSettings(data);
        savedSettingOrigin.value = implementActiveFIlter(transformSettings(data));
        savedSettingsQH.value = implementActiveFIlter(transformSavedSettings(data));
      } catch (e: any) {
        ErrorsModule.showErrorMessage(e.message);
      }
      isSettingsFetch.value = false;
    }
    async function collectionFilter(data: any) {
      console.log(data);
    }
    async function timeFilter(unixTime: number): Promise<void> {
      unix.value = unixTime;
      const data = await QueryHistoryService.getSettingsSortByTime(
        AdminModule.permissions.UserName,
        unixTime,
        tableContent.value,
        !tableMode.value,
      );
      // this.savedSettingOrigin = this.transformSettings(data);
      // this.savedSettingsQH = this.transformSavedSettings(data);
      backupSavedSettingOrigin.value = transformSettings(data);
      backupSavedSettingsQH.value = transformSavedSettings(data);
      console.log(
        'implementActiveFIlter(transformSettings(data))',
        implementActiveFIlter(transformSettings(data)),
      );

      savedSettingOrigin.value = implementActiveFIlter(transformSettings(data));
      savedSettingsQH.value = implementActiveFIlter(transformSavedSettings(data));
    }

    const groups: ComputedRef<Array<{ name: string }>> = computed(() => {
      return AdminModule.groups.map(i => ({ name: i.Name }));
    });

    const exportV: ComputedRef<boolean> = computed(() => {
      return SaveSettingModule.export;
    });

    const isOpenPermissionDialog: ComputedRef<boolean> = computed(() => {
      return SaveSettingModule.isOpenSavePermissionDialog;
    });

    function openDeleteRecordModal(data: any): void {
      // eslint-disable-next-line no-console
      console.log('open change permission modal', data);
      SaveSettingModule.setSavedQueryData(data);
      SaveSettingModule.openDeleteRecordDialog();
    }
    function openChangePermissionModal(data: any): void {
      SaveSettingModule.setSavedQueryData(data);
      SaveSettingModule.openSavePermissionDialog();
    }

    async function handleClosePermissionPopup(shouldSync: boolean) {
      if (shouldSync) {
        // eslint-disable-next-line no-console
        console.log('SHOULD');
        // this.tableMode = value;
        isSettingsFetch.value = true;

        try {
          const data = await QueryHistoryService.getSettingsSortByTime(
            AdminModule.permissions.UserName,
            unix.value,
            tableContent.value,
            !tableMode.value,
          );
          backupSavedSettingOrigin.value = transformSettings(data);
          backupSavedSettingsQH.value = transformSavedSettings(data);
          savedSettingOrigin.value = implementActiveFIlter(transformSettings(data));
          savedSettingsQH.value = implementActiveFIlter(transformSavedSettings(data));
        } catch (e: any) {
          ErrorsModule.showErrorMessage(e.message);
        }
        isSettingsFetch.value = false;
      }
    }
    return {
      handleClosePermissionPopup,
      openChangePermissionModal,
      openDeleteRecordModal,
      isOpenPermissionDialog,
      exportV,
      groups,
      timeFilter,
      clear,
      changeTableContent,
      implementActiveFIlter,
      applyVersionFilter,
      getSavedSettingOrigin,
      loadConfiguration,
      changeTableMode,
      transformSettings,
      transformSavedSettings,
      deepCloneWithoutCircularReferences,
      parseQueryTipe,
      AdminPermissions,
      reuseTableName,
      tableMode,
      tableContent,
      filterContent,
      isSettingsFetch,
      savedSettingsQH,
      savedSettingOrigin,
      backupSavedSettingsQH,
      backupSavedSettingOrigin,
      unix,
      local_DCH_QUERY_HISTORY,
      usersPermission,
      collectionFilter,
    };
  },
});
</script>

<style module lang="scss">
.table-query-history {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 5px;
}

.time-filter {
  border: 1px solid rgba(43, 42, 44, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.time-filter span {
  text-align: center;
  padding: 0px 10px;
}

.time-filter span:hover {
  border-bottom: 2px solid blue;
}

.span-active {
  border-bottom: 2px solid red;
}

.custome-time-filter {
  position: absolute;
  background-color: grey;
  width: 350px;
  height: 300px;
  z-index: 1000;
  top: 40px;
}

.custome-time-filter input {
  background-color: white;
}

.custome-time-filter-form {
  padding: 20px;
}

.custome-time-filter-form p {
  margin-bottom: 10px;
  margin-top: 10px;
  color: white;
  font-weight: 500;
}

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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(43, 42, 44, 0.4);
  z-index: 3;

  &__body {
    position: absolute;
    overflow: scroll;
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

.table {
  display: flex;
  width: 100%;
  // justify-content: flex-end;
  margin: 15px 0;
  height: 30px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // background-color: white;
    height: 73px;
    padding-left: 24.5px;
    font-weight: 500;
    font-size: 14px;
    color: var(--blue-text-color);

    >div {
      display: flex;
      align-items: center;
      padding-right: 19px;
    }
  }
}

.tooltip {
  position: relative;
  display: inline-block;
  z-index: 100;
  width: calc(100% - 10%);

  &_tooltiptext {
    visibility: hidden;
    width: 100%;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;

    /* Position the tooltip */
    position: absolute;
    bottom: -5px;
    right: 0;
    z-index: 1;
  }
}

.tooltip:hover .tooltip_tooltiptext {
  visibility: visible;
}

// .tab-padding {
//   padding-right: 5px;
// }
.range-label {
  margin-top: 6px;
  padding-top: 4px;
}

.tooltip-margin {
  margin-top: 6px;
}

.columnWidth {
  display: flex;
  background-color: red;
}
</style>
<style>
#gridSettings {
  max-width: 100%;
  width: 100%;
  height: 85%;
}
</style>
