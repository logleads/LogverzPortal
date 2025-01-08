<!-- <template>
  <div>
    <Tabs
      btn-rigth-text="OR"
      btn-left-text="AND"
      :state-b-t-n="isAnd"
      @change-table-content="handleIsAnd"
    />
    <div v-for="(item, index) in lineWithRules" :key="item" :class="$style['query-bilder']">
      <div :class="[$style['query-bilder__item'], $style['margin-top']]">
        <DropDownSimple
          :content="query[index].field"
          :items="fieldsLabel"
          :class="$style['query-bilder__item__input']"
          name="field"
          @select-value="e => handleFields(e.item, index)"
        />
        <DropDownSimple
          :content="query[index].role"
          :items="getRules(index)"
          :class="$style['query-bilder__item__input']"
          name="rules"
          @select-value="e => handleRules(e.item, index)"
        />
      </div>
      <div :class="$style['query-bilder__item']">
        {{ console.log('query[index].value', query[index].value) }}
        <Input
          v-model="query[index].value"
          :class="[$style['query-bilder__item__input'], $style['input-margin']]"
          :from-query-builder="true"
          :disabled="disabledValue(index)"
        />
        <div v-if="index == 0" :class="$style['hover']" @click="add">
          <Icon name="plus" :height="30" :width="30" />
        </div>
        <div v-else :class="$style['hover']" @click="close(index)">
          <Icon name="x-mark" :width="30" :height="30" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DropDownSimple from '~/components/shared/drop-down-simple.vue';
import Icon from '~/components/shared/icon.vue';
import Input from '~/components/shared/input.vue';
import Tabs from '~/components/shared/tabs.vue';
import { DataCollectionModule } from '~/store/modules/data-collection';

interface Field {
  id: string;
  label: string;
  type: string;
}
interface Query {
  role: string;
  field: string;
  typeField: string;
  value: string;
  index: string;
  castType: string | object;
}
import { computed, ComputedRef, defineComponent, onMounted, PropType, Ref, ref, watch } from 'vue';
// @Component({
//   name: 'CollectionGenerator',
//   components: { DropDownSimple, Input, Icon, Tabs },
// })
export default defineComponent({
  name: 'CollectionGenerator',
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { DropDownSimple, Input, Icon, Tabs },
  props: {
    fields: {
      type: Array as PropType<Array<Field>>,
      required: true,
    },
    casts: {
      type: Object,
      required: true,
    },
  },
  // @Prop({ type: Array }) readonly fields!: Array<Field>;
  setup(props, { emit }) {
    const value: Ref<string> = ref('');
    const rule: Ref<string> = ref('');
    const field: Ref<string> = ref('');
    const customQuery: Ref<string> = ref('Type custom rules here');
    const lineWithRules = ref([1]);
    const isAnd: Ref<boolean> = ref(false);
    const isCustomRules: Ref<boolean> = ref(false);
    const batchStart: Ref<string> = ref('0');
    const batchSize: Ref<string> = ref('500');

    const query: Ref<Array<Query>> = ref([
      {
        role: '',
        field: '',
        typeField: '',
        value: '',
        index: '',
        castType: '',
      },
    ]);
    onMounted(() => {
      // console.log('fields', props.fields);
    });

    function transformQuery() {
      updateQuery({
        logicalOperator: isAnd.value ? 'AND' : 'OR',
        children: query.value,
      });
    }

    function checkRulesByTypeJSON(typeField: string | undefined) {
      if (typeField) {
        return typeField.includes('JSON');
      }

      return false;
    }

    function checkRulesForDisableInput(rule: string | undefined) {
      if (rule === 'is empty' || rule === 'is not empty') {
        return true;
      } else {
        return false;
      }
    }

    function disabledValue(index: number): boolean {
      return checkRulesForDisableInput(query.value[index].role);
    }

    function getRules(index: number): Array<string> {
      return checkRulesByTypeJSON(query.value[index].typeField)
        ? ['like', 'not like', 'is empty', 'is not empty']
        : [
            'equals',
            'does not equal',
            'like',
            'not like',
            'smaller',
            'bigger',
            'is empty',
            'is not empty',
          ];
    }

    const fieldsLabel: ComputedRef<Array<string>> = computed(() => {
      return props.fields.map((item: any) => item.label);
    });

    function handleRules(role: string, index: number): void {
      const newQuery = query.value;
      newQuery[index].role = role;
      query.value = [...newQuery];
    }

    function handleIsAnd(): void {
      isAnd.value = !isAnd.value;
      transformQuery();
    }
    function handleCustomQuery(value: string): void {
      customQuery.value = value;
      updateQuery(value);
    }

    watch(query, () => {
      transformQuery();
    });
    const DataType: ComputedRef<string> = computed(() => {
      return DataCollectionModule.DataType;
    });
    watch(DataType, (value: string) => {
      // this.transformQuery();
      lineWithRules.value = [1];
      query.value = [
        {
          role: '',
          field: '',
          typeField: '',
          value: '',
          index: '',
          castType: '',
        },
      ];
      transformQuery();
    });

    function handleFields(field: string, index: number): void {
      console.log('FIELD: ' + field);
      console.log('cast param: ', props.casts);
      const newQuery = query.value;
      newQuery[index].field = field;
      newQuery[index].typeField = props.fields.filter((item: any) => item.label === field)[0].type;
      if (props.casts) {
        newQuery[index].castType = props.casts[field];
      }
      let indexValue = props.fields.findIndex((item: any) => item.label === field);
      if (indexValue != -1) {
        newQuery[index].index = (indexValue + 1).toString();
      }
      query.value = [...newQuery];
    }

    function handleInput(value: string, index: number): void {
      // console.log('query value', value, index);
      const newQuery = query.value;
      newQuery[index].value = value;
      query.value = [...newQuery];
    }

    function handlebatchSize(value: string): void {
      batchSize.value = value;
    }

    function handlebatchStart(value: string): void {
      batchStart.value = value;
    }

    function close(id: number): void {
      lineWithRules.value.splice(id, 1);
      query.value.splice(id, 1);
    }

    function add(): void {
      lineWithRules.value.push(lineWithRules.value[lineWithRules.value.length - 1] + 1);
      query.value.push({} as Query);
    }
    /**
     * TODO: handle this emit later if dosen't work
     */
    // @Emit('update-query')
    function updateQuery(query: any): any {
      console.log('handle emit', query);
      emit('update-query', query);
      return query;
    }
    return {
      updateQuery,
      add,
      close,
      handlebatchStart,
      handlebatchSize,
      handleInput,
      handleIsAnd,
      handleRules,
      fieldsLabel,
      handleFields,
      DataType,
      handleCustomQuery,
      getRules,
      disabledValue,
      checkRulesForDisableInput,
      checkRulesByTypeJSON,
      transformQuery,
      query,
      value,
      rule,
      field,
      customQuery,
      lineWithRules,
      isAnd,
      isCustomRules,
      batchStart,
      batchSize,
    };
  },
});
</script>

<style module lang="scss">
.query-bilder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  flex-direction: row;

  &__limit {
    margin-top: 36px;
  }

  &__item {
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    flex-direction: row;

    &__input {
      width: 90%;

      &__margin {
        margin-top: 9px;
        width: 80%;
      }
    }
  }
}

.hover {
  cursor: pointer;
  // margin-bottom: 6%;
  margin-bottom: 25px;
}

.input-margin {
  margin-bottom: 25px;
}

.margin-top {
  margin-top: 5px;
}
</style>
 -->
 <template>
  <div>
    <div class="filter-container">
      <DxFilterBuilder 
         v-if="shouldRenderFilterBuilder"
        v-model:value="filterValue" 
        :fields="formattedFields"
        :group-operation-descriptions="groupOperationDescriptions"
        @value-changed="onValueChanged" 

      />
      <DxButton text="Apply Filter" type="default" @click="buttonClick" />
      <div class="dx-clearfix" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import DxFilterBuilder from 'devextreme-vue/filter-builder';
import DxButton from 'devextreme-vue/button';

interface Field {
  id: string;
  label: string;
  type: string;
}

const filterValue = ref();
const gridFilterValue = ref();
const lastSelectedField = ref<string | null>(null); // Store the last selected field
  const filterBuilderInstance = ref<any>(null);
    const shouldRenderFilterBuilder = ref(true);  // Control rendering

const props = defineProps<{
  fields: Field[];
  casts: Record<string, any>;
}>();

const emit = defineEmits<{
  (event: 'update-query', query: any): void;
}>();

// Define the operator map
const operatorMap = {
  contains: 'contains',
  notcontains: 'does not equal',
  equals: 'equals',
  'does not equal': 'does not equal',
  like: 'like',
  'not like': 'not like',
  smaller: 'smaller',
  bigger: 'bigger',
  'is empty': 'is empty',
  'is not empty': 'is not empty',
};

// Define group operation descriptions
const groupOperationDescriptions = {
  and: 'And',
  or: 'Or',
  notAnd: '',
  notOr: '',
  addGroup: '',
};

// Format fields for the filter builder
const formattedFields = computed(() => {
  if (props.fields && props.fields.length > 0) {
    return props.fields
      .map(item => {
        if (item && item.label) {
          return {
            dataField: item.label,
            caption: item.label,
          };
        } else {
          console.warn('Field item is missing a label or is undefined', item);
          return null;
        }
      })
      .filter(Boolean);
  } else {
    console.warn('Fields are empty or undefined');
    return [];
  }
});

// Reset the query builder state
const resetQueryBuilderState = () => {
  filterValue.value = null;
  gridFilterValue.value = null;
  if (filterBuilderInstance.value) {
    filterBuilderInstance.value.option('value', null); 
  }
};

// Watch for changes in the `fields` prop
watch(() => props.fields, (newFields, oldFields) => {
      shouldRenderFilterBuilder.value = false; 
  if (newFields !== oldFields) {
    nextTick(() => {
      resetQueryBuilderState();  
      shouldRenderFilterBuilder.value = true;  
    });
  }
}, { immediate: true });


// Watch for changes in the filter value and format it
watch(filterValue, (newFilterValue) => {
  if (newFilterValue) {
    const formattedFilter = formatFilterQuery(newFilterValue);
    gridFilterValue.value = formattedFilter;
  }
});
function onValueChanged(e: any) {
  console.log('Filter Value Changed:', e.value);
}

// Format the filter query
const formatFilterQuery = (query: any) => {
  function parseQuery(queryPart: any, role: any) {
    // Ensure the field is valid
    const field = props.fields?.find(item => item.label === queryPart[0]);
    
    if (!field) {
      console.warn(`Field ${queryPart[0]} not found in fields list.`);
      return null; // Skip if the field doesn't exist
    }
    
    const typeField = field.type;
    return {
      field: queryPart[0],
      typeField: typeField,
      role: operatorMap[queryPart[1]] || queryPart[1],
      value: queryPart[2],
    };
  }

  if (query.length === 3 && typeof query[0] === 'string') {
    return [parseQuery(query, null)].filter(Boolean); // Filter out null values
  }

  if (query.length === 3 && typeof query[0] === 'object') {
    return removeOddIndexes(query)
      .map(item => parseQuery(item, query[1]))
      .filter(Boolean); // Filter out null values
  }
};

function removeOddIndexes(array: any[]) {
  return array.filter((_, index) => index % 2 === 0);
}

// Emit the updated query on button click
function buttonClick() {
  emit('update-query', {
    logicalOperator: filterValue.value[1] || '',
    children: gridFilterValue.value,
  });
}
</script>

<style scoped>
.filter-container {
  background-color: transparent;
  box-shadow:
    0 8px 16px 0 rgba(0, 0, 0, 0.14),
    0 0 2px 0 rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  padding: 5px;
  width: 500px;
  margin: 24px;
}

.dx-filterbuilder {
  background-color: transparent;
  padding: 10px;
}

.dx-button {
  margin: 10px;
  float: right;
}

.dx-filterbuilder .dx-numberbox {
  width: 80px;
}
</style>
