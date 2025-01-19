<template>
  <div>
    <div class="filter-container">
      <DxFilterBuilder v-if="shouldRenderFilterBuilder" v-model:value="filterValue" :fields="formattedFields"
        :group-operations="groupOperations" :max-group-level="0" 
        class="test"
         />
      <div class="dx-clearfix" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import DxFilterBuilder from 'devextreme-vue/filter-builder';
import { DataCollectionModule } from '~/store/modules/data-collection';

interface Field {
  id: string;
  label: string;
  type: string;
}
const filterOperationDescriptions = {
  between: "Between",
  contains: "Contains",
  endsWith: "Ends with",
  equal: "Equals",
  greaterThan: "Greater than",
  greaterThanOrEqual: "Greater than or equal to",
  isBlank: "Is blank",
  isNotBlank: "Is not blank",
  lessThan: "Less than",
  lessThanOrEqual: "Less than or equal to",
  notContains: "Does not contain",
  notEqual: "Does not equal",
  startsWith: "Starts with"
}
const customOperations = [
  {
    name: 'bigger',
    caption: 'Greater',

    hasValue: true,
    icon: 'icon-equal',
    customizeText: (fieldInfo) => `${fieldInfo.value}`,
    dataTypes: ['string', 'number', 'boolean']
  },
  {
    name: 'smaller',
    caption: 'Less',

    hasValue: true,
    icon: 'icon-search',
    customizeText: (fieldInfo) => `${fieldInfo.value}`,
    dataTypes: ['string']
  },
  // Add other custom operations as needed
]

const filterValue = ref();
const gridFilterValue = ref();
const shouldRenderFilterBuilder = ref(true);  // Control rendering
const groupOperations = ref([
  "and",
  "or"
]);

const props = defineProps<{
  fields: Field[];
  casts: Record<string, any>;
}>();

const emit = defineEmits<{
  (event: 'update-query', query: any): void;
}>();

// Define the operator map
const operatorMap = {
  contains: 'like',
  notcontains: 'not like',
  equals: 'equals',
  'does not equal': '!=',
  like: 'LIKE',
  'not like': 'NOT LIKE',
  smaller: '<',
  bigger: '>',
  'is empty': 'IS NULL',
  'is not empty': 'IS NOT NULL',
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
            filterOperations: ['=', '<>', 'contains', '>', '<','>=','<=', 'notcontains'],

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

// watch(() => DataCollectionModule.DatasetName, (newFields, oldFields) => {
//   shouldRenderFilterBuilder.value = false;

//   if (newFields !== oldFields) {
//     nextTick(() => {
//       resetQueryBuilderState();
//       shouldRenderFilterBuilder.value = true;
//     });
//   }
// }, { immediate: true });

// Watch for changes in the filter value and format it
watch(filterValue, (newFilterValue) => {

  if (newFilterValue) {
    const formattedFilter = formatFilterQuery(newFilterValue);
    gridFilterValue.value = formattedFilter;

    emit('update-query', {
      logicalOperator: filterValue.value[1] || '',
      children: gridFilterValue.value,
    });
  } else {
    emit('update-query', {
      logicalOperator: '',
      children: [],
    });
  }

});

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

  else if (typeof query[0] === 'object') {
    return removeOddIndexes(query)
      .map(item => parseQuery(item, query[1]))
      .filter(Boolean); // Filter out null values
  }
};

function removeOddIndexes(array: any[]) {
  return array.filter((_, index) => index % 2 === 0);
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
  width: 80%;
  margin: 24px;
  
}

.dx-filterbuilder {
  background-color: transparent;
  padding: 10px;
}
.test .dx-filter-builder-group-operation {
  background-color: #4caf50 !important; /* Green background /
  color: #ffffff; / White text /
  border-radius: 5px; / Rounded corners */
}
.dx-button {
  margin: 10px;
  float: right;
}

.dx-filterbuilder .dx-numberbox {
  width: 80px;
}
.filter-container .test{
  font-family: 'Roboto', sans-serif;

  
}
/* .test .dx-filterbuilder-group-operation{
  background-color: red !important;
}
.test .dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-group-operation{
  background-color: rgba(0, 0, 0, 0.12) !important;

} */
</style>
