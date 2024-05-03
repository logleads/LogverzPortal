<template>
  <div :class="$style['container']">
    <div :class="$style['icon-bar']">
      <div :class="$style['icon-container']">
        <img
          v-if="isChartT"
          :src="require('~/assets/images/chart_line.png')"
          alt="columnselector"
          width="25"
          height="25"
          @click="() => setChart(false)"
        />
      </div>
      <div :class="$style['icon-container']">
        <img
          v-if="!isChartT"
          :src="require('~/assets/images/chart.svg')"
          alt="columnselector"
          width="25"
          height="25"
          @click="() => setChart(true)"
        />
      </div>
      <div :class="$style['icon-container']">
        <img
          :src="require('~/assets/images/download.png')"
          alt="columnselector"
          width="25"
          height="15"
          @click="exportFunct"
        />
      </div>
      <div :class="$style['icon-container']">
        <img
          :src="require('~/assets/images/refresh.png')"
          alt="columnselector"
          width="15"
          height="15"
          @click="refreshFunc"
        />
      </div>
    </div>
    <p>Selected value: {{ value }}; Selected argument: {{ name }};</p>
    <DxChart id="chart" ref="chart_copy" :data-source="uploadData" @point-click="onClick">
      <DxTooltip :enabled="true" />
      <DxCommonSeriesSettings :type="isChartT ? 'bar' : 'line'" argument-field="name" />
      <DxSeries key="name" value-field="val" name="data" />
      <DxLegend :visible="false" />
    </DxChart>
    <DxChart ref="chartRef" :class="$style['chart']">
      <DxTooltip :enabled="true" :customize-tooltip="customizeTooltip">
        <DxFormat :precision="1" type="largeNumber" />
      </DxTooltip>
      <DxValueAxis title="virtual table">
        <DxGrid :visible="true" />
      </DxValueAxis>
      <DxAdaptiveLayout :width="700" />
      <DxSize :height="320" />
      <DxCommonSeriesSettings type="bar" />
    </DxChart>

    <DxPivotGrid
      id="pivotgrid"
      ref="grid"
      width="auto"
      :data-source="dataSource"
      :allow-sorting-by-summary="false"
      :allow-filtering="true"
      :show-borders="true"
      :show-column-grand-totals="false"
      :show-row-grand-totals="false"
      :show-row-totals="false"
      :show-column-totals="false"
      @content-ready="contentReady"
    >
      <DxFieldChooser :enabled="true" />
    </DxPivotGrid>
  </div>
</template>
<script lang="ts">
import { exportWidgets } from 'devextreme/viz/export';
import {
  DxAdaptiveLayout,
  DxChart,
  DxCommonSeriesSettings,
  DxFormat,
  DxGrid,
  DxLegend,
  DxSeries,
  DxSize,
  DxTooltip,
  DxValueAxis,
} from 'devextreme-vue/chart';
import { DxFieldChooser, DxPivotGrid } from 'devextreme-vue/pivot-grid';
import { json2csv } from 'json-2-csv';
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref } from 'vue';

import { QueryBuilderModule } from '~/store/modules/query-builder';
import { CloudTrailDataResponse } from '~/types/models/query-builder-types';
import { transformHeader } from '~/utils/destructObject';

export default defineComponent({
  name: 'PivotGridComponent',
  components: {
    DxChart,
    DxFormat,
    DxAdaptiveLayout,
    DxCommonSeriesSettings,
    DxSize,
    DxTooltip,
    DxPivotGrid,
    DxLegend,
    DxFieldChooser,
    DxSeries,
    DxValueAxis,
    DxGrid,
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
    const isChartT: Ref<boolean> = ref(true);
    const value: Ref<string> = ref('');
    const name: Ref<string> = ref('');
    const uploadData: Ref<any> = ref([]);
    const headers: Ref<string[]> = ref([]);
    const grid: Ref<any> = ref(null);
    const chartRef: Ref<any> = ref(null);
    const chart_copy: Ref<any> = ref(null);

    onMounted(() => {
      const pivotGrid = grid.value.instance;
      const chart = chartRef.value.instance;
      pivotGrid.bindChart(chart, {
        dataFieldsDisplayMode: 'splitPanes',
        alternateDataFields: false,
      });
    });

    function setChart(st: boolean): void {
      isChartT.value = st;
    }

    function exportFunct(): void {
      const instance = chart_copy.value.instance;

      exportWidgets([[instance]], {
        fileName: 'chart',
        format: 'PNG',
      });
    }

    // customizeText({ valueText }: any): any {
    //   return `${valueText}&#176F`;
    // }

    function contentReady(): void {
      setTimeout(() => {
        uploadData.value = chartRef.value.instance.getDataSource()._items.map((item: any) => {
          return {
            val: item.val ? item.val : 0,
            name: item.series,
          };
        });
      }, 500);
    }

    function customizeTooltip(args: any): any {
      const valueText = parseInt(args.originalValue);

      return {
        html: `${args.seriesName}<div class='currency'>${valueText}</div>`,
      };
    }

    function onClick(e: any): void {
      // eslint-disable-next-line no-console
      console.log(e.target.argument, e.target.originalValue);
      value.value = e.target.originalValue;
      name.value = e.target.argument;
    }

    function refreshFunc(): void {
      chart_copy.value.instance.refresh();
      grid.value.instance.updateDimensions();
    }

    const items: ComputedRef<CloudTrailDataResponse[] | null> = computed(() => {
      const data = QueryBuilderModule.dataForAllWindows[props.dataNumber as number]
        ? QueryBuilderModule.dataForAllWindows[props.dataNumber as number].data.map(
            (i: Record<string, unknown>) => i,
          )
        : [];

      const sortedBySelectedColum = data.map((item: Record<string, unknown>) => {
        const obj: Record<string, unknown> = {};
        Object.keys(item).map((key: string) => {
          obj[key] = item[key];
        });

        return obj;
      });
      const json2csvCallback = (err: unknown, csv: string | undefined) => {
        if (err) throw err;
        if (csv) {
          const tmp = csv as string;
          const arr = tmp.split('\n');
          headers.value = arr[0].split(',').map((item: any) => {
            return item.replaceAll('.', '-').toLowerCase();
          });
        }
      };

      json2csv(sortedBySelectedColum as CloudTrailDataResponse[], json2csvCallback);
      return sortedBySelectedColum;
    });

    const dataSource: ComputedRef<Array<unknown>> = computed(() => {
      const data = (items.value as unknown as Array<Record<string, unknown>>).map(
        (item: Record<string, unknown>) => {
          const obj: Record<string, unknown> = {};
          Object.keys(item).map((key: string) => {
            if (key.includes('unixtime')) {
              obj[key] = new Date(parseInt(item[key] as string)).toString();
              obj['origin' + key] = item[key];
            } else {
              obj[key] = item[key];
            }
          });

          return transformHeader(obj);
        },
      );

      return data;
    });
    return {
      dataSource,
      items,
      refreshFunc,
      onClick,
      customizeTooltip,
      contentReady,
      exportFunct,
      setChart,
      isChartT,
      value,
      name,
      uploadData,
      headers,
      grid,
      chartRef,
      chart_copy,
    };
  },
});
</script>
<style module lang="scss">
.container {
  overflow: scroll;
  height: 100%;
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
#pivotgrid {
  margin-top: 20px;
}
.currency {
  text-align: center;
}

.icon-container {
  position: relative;
  cursor: pointer;
}
.icon-bar {
  display: flex;
  justify-content: space-between;
  width: 70px;
  align-items: center;
}

.pie {
  // background-color: orangered !important;

  &__export {
    // background-color: green !important;
  }
}

.chart {
  width: 100%;
  opacity: 0;
  opacity: 0;
  z-index: -1000000;
  height: 0;
}
</style>
