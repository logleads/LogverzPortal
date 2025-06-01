<template>
  <div class="query-main">
    <div v-if="isFinishConnected" class="query-options">
      <div class="query-options__item">
        <label>
          <p class="customLabel">Sql servers</p>
        </label>
        <DropDownSimple :content="dataBaseCurrentAlias" :items="dataBaseAlias" name="dataBaseCurrentAlias"
          @select-value="handleDBSelect($event)" />
      </div>
      <div class="query-options__item">
        <template v-if="availableTables.length">
          <label>
            <p class="customLabel">Available DataSets</p>
          </label>
          <DropDownSimple :content="currentAvailableTable" :items="availableTables" name="currentAvailableTable"
            @select-value="handleTableSelect($event)" />
        </template>
        <template v-else>
          <span class="choose_db">Select Database server from the dropdown</span>
        </template>
      </div>
    </div>
    <template v-else>
      <Loader accent />
    </template>
    <div class="query-arrow">
      <div class="query-arrow__container" @click.stop="$emit('close-side-bar')">
        <Icon name="arrow-left" :width="5" :height="9" />
      </div>
    </div>
    <div class="container-filter">
      <div class="query-header">
        <p class="query-header__title">Query Builder</p>
      </div>
      <div class="query-container">
        <QueryItem :curent-key="curentKey" :data-number="dataNumber" @update-command="e => (cmd = e)"
          @query-loaded="queryLoaded" />
      </div>
      <div class="query-footer">
        <!-- <Button
          text="Export table"
          class="query-header__btn"
          :disabled="!items"
          :no-load="true"
          @click="exportDataBase
          "
        /> -->
        <MyButton text="Run" :disabled="!currentAvailableTable || disableButton" :no-load="!isSending"
          class="query-header__btn" @click="run" />
        <Loader v-if="isSending" accent />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, ref, watch } from 'vue';

import QueryItem from '~/components/query-builder/query-item.vue';
import MyButton from '~/components/shared/button.vue';
import DropDownSimple from '~/components/shared/drop-down-simple.vue';
import Icon from '~/components/shared/icon.vue';
import Loader from '~/components/shared/loader.vue';
import RTCServiceObj from '~/services/api/rtc-service';
import { QueryBuilderModule } from '~/store/modules/query-builder';
import { SaveSettingModule } from '~/store/modules/save-setting';
import { ServerConnectionModule } from '~/store/modules/server-connection';
import { CloudTrailDataResponse } from '~/types/models/query-builder-types';

export default defineComponent({
  name: 'QueryBuilder',
  components: { Loader, MyButton, QueryItem, Icon, DropDownSimple },
  props: {
    curentKey: {
      type: Number,
      required: true,
    },
    dataNumber: {
      type: Number,
      required: true,
    },
    aliasDB: {
      type: Array,
    },
  },
  setup(props) {
    const isShown = ref(true);
    const disableButton = ref(true);
    const query = ref('');
    const cmd = ref('');

    const dataByKey = computed(() => {
      return QueryBuilderModule.dataForAllWindows[props.dataNumber as number];
    });

    const dataBaseAlias: ComputedRef<Array<string>> = computed(() => {
      // console.log('db-4');
      // console.log('dataByKey.value|>');
      // console.log(dataByKey.value);
      return dataByKey.value ? dataByKey.value.dataBaseAliasItems : [];
    });

    const exportFiles: ComputedRef<string> = computed(() => {
      return dataByKey.value ? dataByKey.value : '';
    });

    const items: ComputedRef<CloudTrailDataResponse[] | null> = computed(() => {
      return dataByKey.value ? dataByKey.value.data : [];
    });

    const dataBaseCurrentAlias: ComputedRef<string> = computed(() => {
      return dataByKey.value ? dataByKey.value.dataBaseCurrentAlias : '';
    });

    const currentAvailableTable: ComputedRef<string> = computed(() => {
      return dataByKey.value ? dataByKey.value.currentAvailableTable : '';
    });

    const isSending: ComputedRef<boolean> = computed(() => {
      return dataByKey.value ? dataByKey.value.isSending : '';
    });

    const availableTables: ComputedRef<string[]> = computed(() => {
      return dataByKey.value ? dataByKey.value.availableTables : '';
    });

    const isFetchingTableKeys: ComputedRef<boolean> = computed(() => {
      return dataByKey.value ? dataByKey.value.isFetchingTableKeys : '';
    });

    const isTablesDataTypeFetching: ComputedRef<boolean> = computed(() => {
      return dataByKey.value ? dataByKey.value.isTablesDataTypeFetching : '';
    });

    const isStreamBusy: ComputedRef<boolean> = computed(() => {
      return ServerConnectionModule.isStreamBusy;
    });

    const isFinishConnected: ComputedRef<boolean> = computed(() => {
      return ServerConnectionModule.isFinishConnected;
    });

    const isServerSending: ComputedRef<boolean> = computed(() => {
      return ServerConnectionModule.isSending;
    });
    // TODO think about it
    function exportDataBase(): void {
      // QueryBuilderModule.toggleForExport(props.dataNumber);
    }

    function handleDBSelect(payload: { item: string; content: string }): void {
      QueryBuilderModule.setAvailableDB({ value: payload.item, key: props.dataNumber });
      SaveSettingModule.saveDataBaseName({ key: props.dataNumber, name: payload.item });
    }

    function handleTableSelect(payload: { item: string; content: string }): void {
      QueryBuilderModule.setCurrentTable({ value: payload.item, key: props.dataNumber });
      SaveSettingModule.saveTableName({ key: props.dataNumber, name: payload.item });
    }
    function run(): void {

      // QueryBuilderModule.toggleForExport(null, 'Query')
      if (cmd.value) {
        sendCmd();
      } else {
        QueryBuilderModule.setKeyForWIndow(props.dataNumber);
        ServerConnectionModule.sendQuery(props.dataNumber);
      }

    }

    function sendCmd(): void {
      
      QueryBuilderModule.setKeyForWIndow(props.dataNumber);
      RTCServiceObj.sendQuery(
        `{"LogverzDBFriendlyName":"${dataBaseCurrentAlias.value}","Mode":"Native","QueryParams":"${cmd.value}"}`,
      );
      setTimeout(() => {
        ServerConnectionModule.setSendingStatus(false);
      }, 500);
    }
    watch(isServerSending, (value: boolean) => {
      // eslint-disable-next-line no-console
      // console.log('is server sending', SaveSettingModule.dataT[props.dataNumber].);
      if (QueryBuilderModule) {
        QueryBuilderModule.setIsSending(value);
      }
    });
    onMounted(() => {
      console.log('spot on', props.dataNumber, QueryBuilderModule.key);
      setTimeout(() => {
        console.log('spot off', props.dataNumber, QueryBuilderModule.key);
        QueryBuilderModule.getDBAlias(props.dataNumber);
        ServerConnectionModule.setWaitedStatus();
      }, 100);
    });
    const exportc: ComputedRef<boolean> = computed(() => {
      return SaveSettingModule.export;
    });
    watch(exportc, (value: boolean) => {
      if (value && SaveSettingModule.key == props.dataNumber) {
        const DataBaseName = SaveSettingModule.dataT[props.dataNumber].DataBaseName;

        const DatasetName = SaveSettingModule.dataT[props.dataNumber].TableName;
        handleDBSelect({ item: DataBaseName, content: DataBaseName });
        setTimeout(() => {
          handleTableSelect({ item: DatasetName, content: DatasetName });
          setTimeout(() => run(), 5000);
        }, 1000);
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function queryLoaded(e: boolean): void {
      disableButton.value = false;
    }
    return {
      sendCmd,
      run,
      handleTableSelect,
      handleDBSelect,
      exportDataBase,
      isFinishConnected,
      isStreamBusy,
      isTablesDataTypeFetching,
      isFetchingTableKeys,
      availableTables,
      isSending,
      currentAvailableTable,
      dataBaseCurrentAlias,
      items,
      exportFiles,
      dataBaseAlias,
      dataByKey,
      isShown,
      query,
      cmd,
      isServerSending,
      queryLoaded,
      disableButton,
    };
  },
});
</script>

<style scoped lang="scss">
.choose_db {
  margin-bottom: 20px;
}

.group-selection {
  background: red;
}

.container-filter {
  padding-left: 10px;
}

.query-main {
  position: relative;
  left: 0;
  width: 100%;
  background-color: white;
  height: 100%;
  z-index: 100;
  border-right: 1px solid #000;
  overflow-y: scroll;

  &__hidden {
    display: none;
  }

  &::-webkit-scrollbar {
    width: 10px;
    height: 0;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 31px;
  }
}

.customLabel {
  margin-bottom: 10px !important;
}

.query-arrow {
  background-color: var(--background-color);
  height: 19px;
  border: 1px solid #ecedef;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  &__container {
    margin-right: 6.75px;
    cursor: pointer;
  }
}

.query-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__title {
    color: var(--blue-text-color);
    font-weight: 500;
    font-size: 14px;
    line-height: 319.69%;
  }

  &__btn {
    width: 84px;
    height: 35px;
    font-weight: 500;
  }
}

.query-container {
  overflow: hidden;

  &__hidden {
    opacity: 0;
  }

  &::-webkit-scrollbar {
    width: 3px;
    height: 18px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--accent-color);
    border-radius: 31px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--accent-color);
  }
}

.query-footer {
  display: flex;
  padding: 12px 32px 20px 0px;
  background: white;
  align-items: center;
  justify-content: space-between;
  -webkit-box-shadow: -3px -36px 84px -26px rgba(34, 60, 80, 0.21);
  -moz-box-shadow: -3px -36px 84px -26px rgba(34, 60, 80, 0.21);
  box-shadow: -3px -36px 84px -26px rgba(34, 60, 80, 0.21);

  &__export {
    border: 1px solid rgba(159, 166, 177, 0.22);
    width: 97px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    font-weight: 500;
    font-size: 12px;
    color: var(--blue-text-color);
  }

  &.hidden {
    box-shadow: none;
  }

  >div {
    width: 97px;
  }

  &__btn {
    width: 153px;
    height: 44px;
    font-weight: 500;
    font-size: 14px;
    line-height: 1;
  }
}

.query-options {
  margin-top: 30px;
  width: 90%;
  padding-left: 10px;
  font-weight: 500;
  font-size: 12px;
  color: var(--ink-color);

  &__item {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>
