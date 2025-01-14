<template>
  <div>
    <div class="filter-container">
      <DxFilterBuilder v-if="shouldRenderFilterBuilder" v-model:value="filterValue" :fields="formattedFields"
        :group-operations="groupOperations" :max-group-level="0" :custom-operations="customOperations"
         />
      <div class="dx-clearfix" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import DxFilterBuilder from 'devextreme-vue/filter-builder';

interface Field {
  id: string;
  label: string;
  type: string;
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


// Watch for changes in the filter value and format it
watch(filterValue, (newFilterValue) => {
  if (newFilterValue) {
    const formattedFilter = formatFilterQuery(newFilterValue);
    gridFilterValue.value = formattedFilter;
    emit('update-query', {
      logicalOperator: filterValue.value[1] || '',
      children: gridFilterValue.value,
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

  if (query.length === 3 && typeof query[0] === 'object') {
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

.dx-button {
  margin: 10px;
  float: right;
}

.dx-filterbuilder .dx-numberbox {
  width: 80px;
}
</style>
