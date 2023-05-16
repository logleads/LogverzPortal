<template>
  <div>
    <CollectionGenerator
      :fields="rules"
      :casts="castForParameters"
      @update-query="updateQueryWatch"
    />
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, Ref, ref, watch } from '@vue/composition-api';

//import VueQueryBuilder from 'vue-query-builder';
import CollectionGenerator from '~/components/create-query/collection-rules/collection-builder-slots/collection-generator.vue';
import { DataCollectionModule } from '~/store/modules/data-collection';
import { QueryBuilderLabels, QueryBuilderRule } from '~/types/models/query-builder-types';

export default defineComponent({
  name: 'CollectionRulesItem',
  components: {
    CollectionGenerator,
  },
  setup(props, { emit }) {
    const clearQuery = ref(false);

    const query: Ref<any> = ref({
      children: [],
    });

    function updateQueryWatch(a: unknown): void {
      updateQuery(a);
    }
    watch(query, (val: unknown) => {
      DataCollectionModule.setQuery(val);
      updateQuery(val);
    });

    function updateQuery(query: any): unknown {
      // console.log('coming here 1', query);
      emit('update-query', query);
      return query;
    }
    const rules: ComputedRef<Array<QueryBuilderRule>> = computed(() => {
      return DataCollectionModule.rules;
    });
    const castForParameters: ComputedRef<{ [key: string]: string }> = computed(() => {
      return DataCollectionModule.castForParameters;
    });
    watch(rules, () => {
      query.value = {
        children: [],
      };
    });

    const labels: ComputedRef<QueryBuilderLabels> = computed(() => {
      return DataCollectionModule.labels;
    });
    return {
      labels,
      rules,
      updateQuery,
      updateQueryWatch,
      query,
      clearQuery,
      castForParameters,
    };
  },
});
</script>

<style module lang="scss">
.query-builder-item {
  width: 100%;
}
</style>
