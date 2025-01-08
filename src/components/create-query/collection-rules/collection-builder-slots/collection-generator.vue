<template>
  <div>
    <div class="filter-container">
      <DxFilterBuilder v-if="shouldRenderFilterBuilder" v-model:value="filterValue" :fields="formattedFields"
        :group-operations="groupOperations" 
        :max-group-level="0"
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
function handleOptionClick(option) {
  console.log("option",option);
  
      // Handle "Add Group" removal based on a condition
      // if (option.value === "add-group") {

      // }
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
  width:80%;
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
