<template>
  <div>
    <Tabs
      btn-rigth-text="OR"
      btn-left-text="AND"
      :state-b-t-n="isAnd"
      @change-table-content="handleIsAnd"
    />
    <div v-for="(item, index) in lineWithRules" :key="item" :class="$style['query-bilder']">
      <div :class="$style['query-bilder__item']">
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
        <Input
          :class="[$style['query-bilder__item__input'], $style['input-margin']]"
          :value="query[index].value"
          :disabled="disabledValue(index)"
          @input="e => handleInput(e, index)"
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
}
import {
  computed,
  ComputedRef,
  defineComponent,
  onMounted,
  PropType,
  Ref,
  ref,
  watch,
} from '@vue/composition-api';
// @Component({
//   name: 'CollectionGenerator',
//   components: { DropDownSimple, Input, Icon, Tabs },
// })
export default defineComponent({
  name: 'CollectionGenerator',
  components: { DropDownSimple, Input, Icon, Tabs },
  props: {
    fields: {
      type: Array as PropType<Array<Field>>,
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
      },
    ]);
    onMounted(() => {
      console.log('fields', props.fields);
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
        },
      ];
      transformQuery();
    });

    function handleFields(field: string, index: number): void {
      const newQuery = query.value;
      newQuery[index].field = field;
      newQuery[index].typeField = props.fields.filter((item: any) => item.label === field)[0].type;

      let indexValue = props.fields.findIndex((item: any) => item.label === field);
      if (indexValue != -1) {
        newQuery[index].index = (indexValue + 1).toString();
      }
      query.value = [...newQuery];
    }

    function handleInput(value: string, index: number): void {
      console.log('query value', value, index);
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
</style>
