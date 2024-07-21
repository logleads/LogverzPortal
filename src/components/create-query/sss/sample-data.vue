<template>
  <div :class="$style['fields-container']">
    <Icon name="arrow-down" :width="12" :height="7.7" />
    <button type="button" @click="onTriger">
      <p>{{ triger ? 'Close sample data' : 'Open sample data' }}</p>
    </button>
    <template v-if="triger">
      <template v-if="isSample">
        <json-viewer
          v-if="!isRow"
          :value="sampleData"
          :expand-depth="5"
          copyable
          boxed
          sort
        ></json-viewer>
        <DxDataGrid
          v-if="isRow"
          id="gridContainer3"
          :show-borders="true"
          :data-source="sampleData"
          :show-column-lines="true"
          :show-row-lines="true"
          :allow-column-reordering="true"
          :column-auto-width="true"
        >
          <DxHeaderFilter :visible="true" />
        </DxDataGrid>
        <p>
          <br />
          Log file information and further examples: <a :href="url" target="_blank">{{ url }}</a>
        </p>
      </template>
      <template v-else>
        <p>No Sample data available</p>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref } from '@vue/composition-api';
import { DxDataGrid, DxHeaderFilter } from 'devextreme-vue/data-grid';

import Icon from '~/components/shared/icon.vue';
import { DataCollectionModule } from '~/store/modules/data-collection';

export default defineComponent({
  name: 'SampleDataCollection',
  components: { DxDataGrid, Icon, DxHeaderFilter },
  setup() {
    const triger: Ref<boolean> = ref(false);
    function onTriger(): void {
      triger.value = !triger.value;
    }

    onMounted(() => {
      DataCollectionModule.getSampleData('ApplicationLB');
    });

    const sampleData: ComputedRef<any> = computed(() => {
      // eslint-disable-next-line no-console
      console.log(DataCollectionModule.sampleData);

      if (DataCollectionModule.sampleData === 'Non') {
        return {
          value: 'No Sample data available',
        };
      }
      const rules = DataCollectionModule.rules.map(
        ({ label }: { id: string; label: string; type: string }): string => {
          return label;
        },
      );

      const s = DataCollectionModule.sampleData.replaceAll('     ', ' ');
      const f = s.replaceAll('  ', ' ');
      const g = f.replaceAll('\n', ' ');
      let res: {
        Rows: string[];
        Info: string;
        Records: string;
      } | null = null;

      if (!(DataCollectionModule.sampleData === '')) {
        res = JSON.parse(g);
      }
      if (res?.Rows) {
        const b = res?.Rows.map((item: string) => {
          const dataBuffer = item.match(/\'(.*?)\'/g);

          if (!dataBuffer) {
            return item
              .split(' ')
              ?.map((it, index) => {
                return {
                  [rules[index]]: it,
                };
              })
              .reduce((acc, i) => {
                if (Object.keys(i).includes('undefined')) {
                  return {
                    ...acc,
                  };
                } else {
                  return {
                    ...acc,
                    ...i,
                  };
                }
              }, {});
          }

          const str = dataBuffer?.reduce((acc, it) => {
            return acc.replaceAll(it, '');
          }, item);

          let i = 0;
          const buff = str?.split(' ').map(it => {
            if (it == '') {
              return dataBuffer ? dataBuffer[i++] : dataBuffer;
            } else {
              return it;
            }
          });

          return buff
            ?.map((it, index) => {
              return {
                [rules[index]]: it,
              };
            })
            .reduce((acc, i) => {
              if (Object.keys(i).includes('undefined')) {
                return {
                  ...acc,
                };
              } else {
                return {
                  ...acc,
                  ...i,
                };
              }
            }, {});
        });

        return b;
      }

      return res;
    });

    const isRow: ComputedRef<boolean> = computed(() => {
      const sampleData = DataCollectionModule.sampleData;
      if (sampleData === 'Non') {
        return false;
      }
      const s = sampleData.replaceAll('     ', ' ');
      const f = s.replaceAll('  ', ' ');
      const g = f.replaceAll('\n', ' ');
      let res: {
        Rows: string[];
        Info: string;
      } | null = null;

      if (!(DataCollectionModule.sampleData === '')) {
        res = JSON.parse(g);
      }

      return Boolean(res?.Rows);
    });

    const isSample: ComputedRef<boolean> = computed(() => {
      const sampleData = DataCollectionModule.sampleData;
      if (sampleData === 'Non') {
        return false;
      }

      return Boolean(true);
    });

    const url: ComputedRef<string> = computed(() => {
      const sampleData = DataCollectionModule.sampleData;
      if (sampleData === 'Non') {
        return '#';
      }
      const s = sampleData.replaceAll('     ', ' ');
      const f = s.replaceAll('  ', ' ');
      const g = f.replaceAll('\n', ' ');
      let res: {
        Rows: string[];
        Info: string;
      } = { Rows: [], Info: '' };

      if (!(DataCollectionModule.sampleData === '')) {
        res = JSON.parse(g);
      }

      return res.Info;
    });

    return {
      url,
      isSample,
      isRow,
      sampleData,
      onTriger,
      triger,
    };
  },
});
</script>

<style module lang="scss">
.item-field {
  display: flex;
  align-items: center;
  margin: 15px 0;
  &__key {
    font-size: 14px;
    margin-right: 10px;
    color: var(--secondary-text-color);
  }
  &__value {
    font-size: 14px;
    max-width: 100%;
    overflow: hidden;
  }
}
.fields-container {
  margin-top: 23px;
  margin-bottom: 13px;
  background-color: var(--gray-background);
  border-radius: 5px;
  padding: 21.5px 30px 25.5px 30px;
}
.error {
  color: red;
}
</style>
