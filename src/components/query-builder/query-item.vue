<template>
  <div :class="$style['query-item']">
    <template v-if="currentAvailableTable && !noDataType && rules && rules.length">
      <div :class="$style['query-item__container']">
        <QueryGenerator
          :fields="rules"
          :curent-key="curentKey"
          :data-number="dataNumber"
          :class="$style['query-item__container__el']"
          :curent-table="currentAvailableTable"
          :type-data-base="dataBaseEngineItems"
          @update-query="setCommand"
        />
        <!-- :type-data-base="dataBaseCurrentAlias === 'DefaultDB' ? 'postgresql' : 'mysql'" -->
      </div>
    </template>
    <template v-else-if="rules && rules.length === 0 && !noDataType">
      <div>
        <h1 :class="$style['query-error']">Choose DataSet for query</h1>
      </div>
    </template>
    <template v-else-if="noDataType">
      <div>
        <h1 :class="$style['query-error']">Choose DataSet with another data type</h1>
      </div>
    </template>
    <template v-else>
      <Loader accent />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, Ref, ref, watch } from '@vue/composition-api';

import QueryGenerator from '~/components/query-builder/query-slots/query-generator.vue';
import Loader from '~/components/shared/loader.vue';
import { QueryBuilderModule } from '~/store/modules/query-builder';
import { logicalOperatorType, MainQuery } from '~/types/common';
import { DataBaseTypes } from '~/types/data-base-type';
import { QueryBuilderRule } from '~/types/models/query-builder-types';

export default defineComponent({
  name: 'QueryItem',
  components: {
    Loader,
    QueryGenerator,
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
  setup(props, { emit }) {
    const query: Ref<MainQuery> = ref({
      logicalOperator: logicalOperatorType.OR,
      children: [],
    });

    const showQuery: Ref<string> = ref('');
    const cmd = ref('');

    watch(query, (val: MainQuery) => {
      QueryBuilderModule.setQuery({ value: val, key: props.dataNumber });
    });

    const noDataType: ComputedRef<boolean> = computed(() => {
      return QueryBuilderModule.dataForAllWindows[props.dataNumber as number]
        ? QueryBuilderModule.dataForAllWindows[props.dataNumber as number].noDataType
        : '';
    });

    const rules: ComputedRef<Array<QueryBuilderRule> | null> = computed(() => {
      return QueryBuilderModule.dataForAllWindows[props.dataNumber as number]
        ? QueryBuilderModule.dataForAllWindows[props.dataNumber as number].rules || []
        : [];
    });

    const currentAvailableTable: ComputedRef<string> = computed(() => {
      return QueryBuilderModule.dataForAllWindows[props.dataNumber as number]
        ? QueryBuilderModule.dataForAllWindows[props.dataNumber as number].currentAvailableTable
        : '';
    });

    const dataBaseCurrentAlias: ComputedRef<string> = computed(() => {
      // console.log("line 91")
      return QueryBuilderModule.dataForAllWindows[props.dataNumber as number]
        ? QueryBuilderModule.dataForAllWindows[props.dataNumber as number].dataBaseCurrentAlias
        : '';
    });
    const dataBaseEngineItems: ComputedRef<string> = computed(() => {
      let engineData = QueryBuilderModule.dataForAllWindows[props.dataNumber as number]
        ? QueryBuilderModule.dataForAllWindows[props.dataNumber as number].dataBaseEngineItems
        : '';
      const data = engineData.find((engine: any) => engine.name == dataBaseCurrentAlias.value);
      // console.log("engineData",data)
      if (data.value.includes('sqlserver')) {
        return DataBaseTypes.MSSQL;
      }
      return data.value;
    });

    function setCommand(e: string): void {
      cmd.value = e;
      // updateCommand();
      emit('update-command', cmd.value);
    }

    // @Emit('update-command')
    // updateCommand(): string {
    //   return this.cmd;
    // }
    return {
      setCommand,
      dataBaseEngineItems,
      dataBaseCurrentAlias,
      currentAvailableTable,
      rules,
      noDataType,
      cmd,
      showQuery,
      query,
    };
  },
});
</script>

<style module lang="scss">
.query-builder-item {
  width: 100%;
}

.buttons-selection {
  width: 123px;
  display: flex;
  justify-content: space-between;
}

.query-builder-root {
  width: 100%;
}

.query-item {
  &__container {
    width: 100%;
    &__el {
      width: 90%;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;

    &__buttons {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}

.query-error {
  font-weight: 500;
  font-size: 18px;
  color: var(--ink-color);
}
</style>
