<!-- eslint-disable no-console -->
<template>
  <div :class="$style['data-container']">
    <template v-if="items !== null">
      <DataColumnComponent
        :headers="headers"
        :items-remastered="itemsRemastered"
        :rawitems="rawItems"
        :curent-key="curentKey"
        :data-number="dataNumber"
      />
    </template>
  </div>
</template>

<script lang="ts">
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.greenmist.css';

import { json2csv } from 'json-2-csv';
import { computed, ComputedRef, defineComponent, Ref, ref } from 'vue';

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

    function filterBySelectCollums(key: string) {
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

        return obj;
      });
      const json2csvCallback = (err: unknown, csv: string | undefined) => {
        
        if (err){
          console.log("err---");
          throw err;
        }
          
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
    };
  },
});
</script>

<style module lang="scss">
.data-container {
  width: 100%;
  height: 100%;
}
</style>
