<template>
  <div :class="$style['collection']">
    <template v-if="!isFetching">
      <div v-show="!isCustomRules">
        <CollectionRulesItem :class="$style['collection__item']" @update-query="handleUpdate" />
      </div>
      <SampleDataCollection />

      <div :class="$style['collection__item']">
        <div :class="$style['collection__item__inputs']">
          <div :class="$style['checkbox-label']">
            <label :class="$style['input-item-text']"> Custom rules editor field </label>
            <input v-model="isCustomRules" type="checkbox" />
          </div>
          <Input
            v-if="isCustomRules"
            slot="input"
            v-model="QueryFromState"
            :disabled="!isCustomRules"
            placeholder="Type custom rules here"
            :class="[$style['input-border'], { [$style['disabled']]: !isCustomRules }]"
          />
          <div v-else>
            <!-- <div :class="$style['input-item-text']">Generated rules query display field</div> -->
            <div :class="$style['generated-query']">
              <!-- <highlight-code lang="sql">
                {{ QueryFromState }}
              </highlight-code> -->
              <pre v-highlightjs="QueryFromState"><code class="sql"></code></pre>

              <div
                v-if="
                  submitted
                  //  && v$.QueryFromState.required.$invalid
                "
                :class="$style['validation-text']"
              >
                Query string is required
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <Loader />
    </template>
  </div>
</template>

<script lang="ts">
// import { useVuelidate } from '@vuelidate/core';
// import { required } from '@vuelidate/validators';
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref, watch } from 'vue';

import CollectionRulesItem from '~/components/create-query/collection-rules/collection-rules-item.vue';
import SampleDataCollection from '~/components/create-query/sss/sample-data.vue';
import Input from '~/components/shared/input.vue';
import Loader from '~/components/shared/loader.vue';
import { DataCollectionModule } from '~/store/modules/data-collection';
import { logicalOperatorType, MainQuery } from '~/types/common';
import { QueryBuilderRule } from '~/types/models/query-builder-types';
import { parseQueryObject } from '~/utils/parseQueryObject';
import { parseToSequelize } from '~/utils/sequelize-query';

export default defineComponent({
  name: 'CollectionRules',
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Loader, CollectionRulesItem, Input, SampleDataCollection },
  props: {
    submitted: {
      type: Boolean,
      required: false,
    },
    isFetching: {
      type: Boolean,
      required: false,
    },
  },
  setup(props, { emit }) {
    const isCustomRules: Ref<boolean> = ref(false);
    const query: Ref<MainQuery> = ref({
      logicalOperator: logicalOperatorType.OR,
      children: [],
    });

    const textarea: Ref<HTMLElement | any> = ref(null);
    const customQuery: Ref<any> = ref('');

    const rootElements: ComputedRef<any> = computed(() => {
      return DataCollectionModule.rootsForJSON;
    });
    const DataType: ComputedRef<string> = computed(() => {
      return DataCollectionModule.DataType;
    });
    const QueryString: ComputedRef<string> = computed(() => {
      return parserQuery(
        query.value,
        TablesTypes.value[DataType.value],
        rootElements.value[DataType.value],
        CsvHeaderInfo.value,
      );
    });

    const items: Ref<Array<{ id: number }>> = ref([{ id: 1 }, { id: 2 }]);

    watch(isCustomRules, (value: boolean) => {
      console.log("IS CUSTOME RULE", query.value)
      DataCollectionModule.setInputValue({
        label: 'QueryString',
        value: parserQuery(
          query.value,
          TablesTypes.value[DataType.value],
          rootElements.value[DataType.value],
          CsvHeaderInfo.value,
        ),
      });
      // }
    });

    const QueryFromState: ComputedRef<string> = computed(() => {
      console.log('DataCollectionModule.queryString', DataCollectionModule.queryString);
      return DataCollectionModule.queryString.replaceAll('.undefined', ' ');
    });
    const rules: ComputedRef<Array<QueryBuilderRule>> = computed(() => {
      return DataCollectionModule.rules;
    });

    const TablesTypes: ComputedRef<{ [key: string]: string }> = computed(() => {
      return DataCollectionModule.tableTypes;
    });

    const CsvHeaderInfo: ComputedRef<string> = computed(() => {
      return DataCollectionModule.csvHeader;
    });
    watch(customQuery, (value: string) => {
      if (isCustomRules.value) {
        console.log("customQuery",value);
        // DataCollectionModule.setInputValue({ label: 'QueryString', value });
        DataCollectionModule.setInputValue({
        label: 'QueryString',
        value: value
      });
      }
    });
    watch(rules, () => {
      query.value = {
        logicalOperator: logicalOperatorType.OR,
        children: [],
      };
    });
    watch(QueryString, (value: string) => {
      if (!isCustomRules.value) {
        DataCollectionModule.setInputValue({
          label: 'QueryString',
          value,
        });
      }
    });
    watch(QueryFromState, () => {
      // textarea.value.style.height = '1px';
      // textarea.value.style.height = 25 + textarea.value.scrollHeight + 'px';
    });

    function handleUpdate(queryParam: MainQuery): void {
      query.value = queryParam;
      DataCollectionModule.setInputValue({
        label: 'QueryString',
        value: parserQuery(
          query.value,
          TablesTypes.value[DataType.value],
          rootElements.value[DataType.value],
          CsvHeaderInfo.value,
        ),
      });
    }

    function parserQuery(
      query: MainQuery,
      format: string,
      rootJSON: string,
      csvHeader: string,
    ): string {
      // console.log('query =', query);
      return parseQueryObject(query, format, rootJSON, csvHeader);
    }
    function sqlToSequelize(query: MainQuery): string {
      return parseToSequelize(query);
    }
    // const validationRules = {
    //   QueryFromState: { required },
    // };
    // const v$ = useVuelidate(validationRules, {
    //   QueryFromState,
    // });
    onMounted(async () => {
      // emit('validate', v$);
      query.value = {
        logicalOperator: logicalOperatorType.OR,
        children: [],
      };
    });
    return {
      sqlToSequelize,
      parserQuery,
      handleUpdate,
      DataType,
      CsvHeaderInfo,
      TablesTypes,
      rules,
      QueryFromState,
      items,
      QueryString,
      rootElements,
      customQuery,
      textarea,
      query,
      isCustomRules,
      // v$,
    };
  },
});
</script>

<style module lang="scss">
.collection {
  &__item {
    margin-top: 23px;
    margin-bottom: 13px;
    background-color: var(--gray-background);
    border-radius: 5px;
    padding: 21.5px 30px 25.5px 30px;

    &__inputs {
      // max-width: 845px;
      margin-bottom: 25px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.display-query {
  input {
    background: transparent;
    border: none;
  }
}

.disabled {
  input {
    background: transparent;
  }
}

.checkbox-label {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.input-item-text {
  align-items: center;
  font-size: 14px;
  margin-right: 10px;
  color: var(--secondary-text-color);
}

.generated-query {
  margin-top: 10px;
  &__text-area {
    width: 100%;
    resize: none;
    height: 100%;

    &::-webkit-scrollbar {
      width: 3px;
      height: 18px;
    }
    /* Track */
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: var(--accent-color);
      border-radius: 31px;
    }
    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: var(--accent-color);
    }
  }
}

.validation-text {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
code {
  height: 95px !important;
  width: 100%;
  border: 3px solid;
  // word-break: break-word;
}

pre {
  white-space: pre-wrap;
}
.input-border {
  border: 1px solid #45e799;
  margin-top: 2px;
}
</style>
