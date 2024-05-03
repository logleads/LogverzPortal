<template>
  <div :class="$style['table']" @click="closeSettings">
    <!-- <div :class="$style['big-alert']"></div> -->
    <div :class="$style['table__header']">
      <div :class="$style['table-top']">
        <MyButton
          v-if="tableMode"
          text="Export table"
          :class="[$style['query-header__btn'], $style['query-button-padding']]"
          :disabled="!items"
          :no-load="true"
          @click="exportDataBase"
        />
        <button
          :class="[$style['btn'], $style['query-button-padding'], $style['query-button-margin']]"
          @click="saveConfig"
        >
          save config
        </button>
        <TabsSimple
          btn-rigth-text="Pivot table"
          btn-left-text="Data table"
          :state-b-t-n="tableMode"
          @change-table-content="changeTableMode"
        />

        <div :class="$style['icon-container']" @click.stop="log('test')">
          <div @click.stop="toggleSettings">
            <img
              :src="require('~/assets/images/columnselector.png')"
              alt="columnselector"
              width="25"
              height="25"
            />
          </div>
          <query-table-settings
            v-if="showSettings"
            :class="$style['big-alert']"
            :curent-key="curentKey"
            :data-number="dataNumber"
            :default-type="defaultType"
          />
        </div>
      </div>
    </div>
    <div :class="$style['table__body']">
      <template v-if="forbiddenObj.status">
        <h1>{{ forbiddenObj.reason }}</h1>
      </template>
      <template v-else>
        <template v-if="items !== null">
          <DataGridComponent v-if="tableMode" :curent-key="curentKey" :data-number="dataNumber" />
          <PivotGridComponent v-else :curent-key="curentKey" :data-number="dataNumber" />
        </template>
        <template v-else>
          <div :class="$style['no-data']">Select DB server and table in the left sidebar</div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, Ref, ref, watch } from 'vue';

import DataGridComponent from '~/components/query-builder/query-table/data-grid-component.vue';
import PivotGridComponent from '~/components/query-builder/query-table/pivot-grid-component.vue';
import QueryTableSettings from '~/components/query-builder/query-table/query-table-settings.vue';
import MyButton from '~/components/shared/button.vue';
import TabsSimple from '~/components/shared/tabs-simple.vue';
import { QueryBuilderModule } from '~/store/modules/query-builder';
import { SaveSettingModule } from '~/store/modules/save-setting';
import { CloudTrailDataResponse } from '~/types/models/query-builder-types';

export default defineComponent({
  name: 'QueryTable',
  components: {
    QueryTableSettings,
    DataGridComponent,
    PivotGridComponent,
    TabsSimple,
    MyButton,
  },
  props: {
    curentKey: {
      type: Number,
      required: true,
    },
    dataNumber: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const tableMode: Ref<boolean> = ref(true);
    const showSettings: Ref<boolean> = ref(false);
    const defaultType: Ref<string> = ref('Default');

    function changeTableMode(): void {
      tableMode.value = !tableMode.value;
      SaveSettingModule.setAnalysisType({
        val: tableMode.value ? 'Data table' : 'Pivot table',
        key: props.dataNumber,
      });
    }

    function closeSettings(): void {
      // eslint-disable-next-line no-console
      console.log(showSettings.value, 'closeSettings');
      showSettings.value = false;
    }

    function toggleSettings(): void {
      QueryBuilderModule.setKeyForWIndow(props.dataNumber);
      showSettings.value = !showSettings.value;
    }
    function saveConfig(): void {
      SaveSettingModule.openDialogWindow();
    }

    function log(v: any): void {
      // eslint-disable-next-line no-console
      console.log(v);
    }

    const getDataByKay: ComputedRef<any> = computed(() => {
      return QueryBuilderModule.dataForAllWindows[props.dataNumber as number];
    });

    const forbiddenObj: ComputedRef<{ status: boolean; reason: string }> = computed(() => {
      return getDataByKay.value ? getDataByKay.value.forbidden : {};
    });

    const items: ComputedRef<CloudTrailDataResponse[] | null> = computed(() => {
      return getDataByKay.value ? getDataByKay.value.data : null;
    });

    const exportc: ComputedRef<boolean> = computed(() => {
      return SaveSettingModule.export;
    });
    // TODO think about it
    function exportDataBase(): void {
      QueryBuilderModule.toggleForExport(props.dataNumber);
    }

    watch(exportc, (value: boolean) => {
      if (value) {
        const data = SaveSettingModule.dataT[props.dataNumber];
        tableMode.value = data.AnalysisType == 'Data table';
        defaultType.value = data.Views;
      }
    });

    return {
      exportDataBase,
      items,
      forbiddenObj,
      getDataByKay,
      log,
      saveConfig,
      toggleSettings,
      closeSettings,
      changeTableMode,
      tableMode,
      showSettings,
      defaultType,
    };
  },
});
</script>

<style module lang="scss">
.no-data {
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 18px;
}
.big-alert {
  z-index: 10000;
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
    font-weight: 450;
    padding: 5px;
    margin: 0 12px;
    height: 25px;
  }
}

.table {
  width: 100%;
  height: 100%;
  &__header {
    display: flex;
    justify-content: end;
    align-items: center;
    background-color: white;
    height: 30px;
    width: 100%;
    padding-left: 24.5px;
    font-weight: 500;
    font-size: 14px;
    color: var(--blue-text-color);
    margin-top: 5px;

    > div {
      display: flex;
      align-items: center;
      padding-right: 19px;
    }

    &__buttons {
      padding: 0 4px;
      display: flex;
      align-items: center;
      margin-right: 18px;
      width: 233px;
      height: 35px;
      background-color: rgba(136, 196, 190, 0.1);
      border-radius: 5px;

      &__btn {
        width: 111px;
        height: 27px;
        font-weight: 500;
        font-size: 12px;
        color: var(--blue-text-color);
        background-color: #ffffff;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.03);
        border-radius: 5px;

        &.active {
          background-color: transparent;
          font-weight: 500;
          font-size: 12px;
          color: var(--accent-color);
          box-shadow: none;
        }
      }
    }
  }

  &__body {
    background-color: white;
    overflow: hidden;
    height: 96%;
    width: 100%;
    border-collapse: collapse;
    font-weight: 500;
    margin-top: 10px;
    font-size: 14px;
    color: var(--blue-text-color);

    &__th {
      font-size: 17px;
      vertical-align: middle;
      text-align: center;
      display: table-cell;
      height: 60.97px;
      min-height: 60.97px;
      width: 176px;
      min-width: 176px;
      max-width: 176px;
      border: 1px solid var(--secondary-text-color);
      border-bottom: none;
      background-color: var(--background-color);
    }

    &__td {
      text-align: center;
      overflow: hidden;
      display: table-cell;
      height: 60.97px;
      min-height: 60.97px;
      min-width: 176px;
      max-width: 176px;
      width: 176px;
      border: 1px solid var(--secondary-text-color);
    }

    &__tr {
      display: table-row;
    }

    &::-webkit-scrollbar {
      width: 2px;
      height: 5px;
      margin: 0 12px 13px 0;
    }
    /* Track */
    &::-webkit-scrollbar-track {
      height: 5px;
      background: #e9ecf0;
    }
    /* Handle */
    &::-webkit-scrollbar-thumb {
      height: 5px;
      background: var(--accent-color);
      border-radius: 31px;
    }

    &::-webkit-scrollbar {
      width: 7px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: var(--accent-color);
    }
  }
}
.icon-container {
  position: relative;
  z-index: 10000;
}

.btn {
  background-color: var(--accent-color);
  border-radius: 5px;
  font-weight: bold;
  color: #fff;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.1s linear;
  padding: 5px 14px;
  cursor: pointer;
}
.table-top {
  padding: 0 6px;
  display: flex;
  align-items: center;
  margin-right: 18px;
  /* width: 133px; */
  height: 35px;
  margin-top: 5px;
}
.query-button-padding {
  border: 1px solid rgba(43, 42, 44, 0.4);
  padding: 5px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.query-button-margin {
  margin-right: 5px;
}
</style>
