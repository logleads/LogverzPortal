<template>
  <div class="data-container">
    <template v-if="items !== null">
      <DataColumnComponent ref="dataColumnRef" :headers="headers" :items-remastered="itemsRemastered"
        :rawitems="rawItems" :curent-key="curentKey" :data-number="dataNumber" />
    </template>
  </div>
</template>

<script lang="ts">
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.greenmist.css';

import { json2csv } from 'json-2-csv';  // Using the synchronous version of the method
import { computed, ComputedRef, defineComponent, Ref, ref, watchEffect } from 'vue';

import { QueryBuilderModule } from '~/store/modules/query-builder';
import { CloudTrailDataResponse } from '~/types/models/query-builder-types';
import { transformHeader } from '~/utils/destructObject';

import DataColumnComponent from './data-colum-templite.vue';

export default defineComponent({
  name: 'DataGridComponent',
  components: {
    DataColumnComponent,
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
    const grid: any = ref(null);

    const headers: Ref<string[]> = ref([]);
    const rawItems: Ref<any> = ref([]);
    const csvData: Ref<string | null> = ref(null); // Store CSV data here
    const dataColumnRef = ref();
    function exportData() {
      dataColumnRef.value?.exportData();
    }
    function filterBySelectCollums(key: string) {
      console.log("key==========", props.dataNumber);

      return QueryBuilderModule.dataForAllWindows[props.dataNumber as number].showCollums
        ? QueryBuilderModule.dataForAllWindows[props.dataNumber as number].showCollums.includes(key)
        : false;
    }

    const isShowTable: ComputedRef<boolean> = computed(() => {
      return QueryBuilderModule.dataForAllWindows[props.dataNumber as number]
        ? QueryBuilderModule.dataForAllWindows[props.dataNumber as number].isShowTable
        : false;
    });

    const items: ComputedRef<CloudTrailDataResponse[] | null> = computed(() => {
      const data = QueryBuilderModule.dataForAllWindows[props.dataNumber as number]
        ? QueryBuilderModule.dataForAllWindows[props.dataNumber as number].data?.map(
          (i: Record<string, unknown>) => i,
        )
        : [];
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      rawItems.value = data;

      const sortedBySelectedColum = data?.map((item: Record<string, unknown>) => {
        const obj: Record<string, unknown> = {};
        Object.keys(item)
          .filter((it: string) => {
            return filterBySelectCollums(it);
          })
          .map((key: string) => {
            obj[key] = item[key];
          });
        console.log("=0000000000000", obj);

        return obj;
      });

      return sortedBySelectedColum;
    });

    // Watch for changes in the items array and generate CSV when it's updated
    watchEffect(() => {
      if (items.value) {
        try {
          // json2csv is now synchronous
          const csv = json2csv(items.value as CloudTrailDataResponse[]);
          csvData.value = csv;
          const tmp = csv as string;
          const arr = tmp.split('\n');
          console.log("=============999", items.value);

          headers.value = arr[0].split(',').map((item: any) => {
            return item.replaceAll('.', '-').toLowerCase();
          });
          console.log("headers.value", headers.value);

        } catch (err) {
          console.error("Error while converting to CSV:", err);
        }
      }
    },);

    const itemsRemastered: ComputedRef<Array<unknown>> = computed(() => {
      const data = (items.value as unknown as Array<Record<string, unknown>>).map(
        (item: Record<string, unknown>, index: any) => {
          const obj: Record<string, unknown> = {};
          Object.keys(item)
            .filter((it: string) => {
              let dat = filterBySelectCollums(it);
              return dat;
            })
            .map((key: string) => {
              if (key.includes('unixtime')) {
                obj[key] = new Date(parseInt(item[key] as string)).toString();
                obj['origin' + key] = item[key];
              } else {
                obj[key] = item[key];
              }
              obj['rawIndex'] = index;
            });
          return transformHeader(obj);
        },
      );

      return data;
    });

    return {
      itemsRemastered,
      items,
      isShowTable,
      filterBySelectCollums,
      rawItems,
      headers,
      grid,
      csvData,
      dataColumnRef,
      exportData,

    };
  },
});
</script>

<style scoped lang="scss">
.data-container {
  width: 100%;
  height: 100%;
}
</style>
