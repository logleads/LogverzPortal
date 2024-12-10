<template>
  <div>
    <Tabs
      btn-rigth-text="OR"
      btn-left-text="AND"
      :state-b-t-n="isAnd"
      :class="$style['mb5']"
      @change-table-content="handleIsAnd"
    />
    <label>
      <p :class="$style['customLabel']">Available Fields</p>
    </label>
    <div
      v-for="(item, index) in lineWithRules"
      :key="item"
      :class="[$style['query-bilder'], $style['mb5']]"
    >
      <DropDownSimple
        :content="query[index].field"
        :items="fieldsLabel"
        name="field"
        @select-value="e => handleFields(e.item, index)"
      />
      <DropDownSimple
        :content="query[index].role"
        :items="getRules(index)"
        name="rules"
        @select-value="e => handleRules(e.item, index)"
      />
      <Input
        :class="$style['query-bilder__input']"
        :value="query[index].value"
        :disabled="disabledValue(index)"
        :from-query-builder="true"
        @input="e => handleInput(e.target.value, index)"
      />
      <div v-if="index == 0" :class="$style['hover']" @click="add">
        <Icon name="plus" :height="30" :width="30" />
      </div>
      <div v-else :class="$style['hover']" @click="close(index)">
        <Icon name="x-mark" :width="30" :height="30" />
      </div>
    </div>
    <div :class="[$style['query-bilder__limit'], $style['mb5']]">
      <label>
        <p :class="$style['customLabel']" >Batch start</p>
      </label>
      <Input
        :value="batchStart"
        :type="'number'"
        :class="$style['query-bilder__input']"
        @input="handlebatchStart"
      />
    </div>
    <div :class="$style['mb5']">
      <label>
        <p :class="$style['customLabel']">Batch size</p>
      </label>
      <Input
        :value="batchSize"
        :type="'number'"
        :class="$style['query-bilder__input']"
        @input="handlebatchSize"
      />
    </div>
    <div :class="[$style['query-bilder__limit'], $style['mb5']]">
      <div :class="$style['colection__item__inputs']">
        <div :class="$style['checkbox-label']">
          <label :class="$style['input-item-text']"> Modify query </label>
          <input v-model="isCustomRules" type="checkbox" />
        </div>
        <br />
        <!-- :value="customQuery.replaceAll('\\', '')" -->
        <textarea
          v-if="isCustomRules"
          :value="customQuery.replaceAll('\\', '')"
          :class="[{ [$style['disabled']]: !isCustomRules }]"
          :disabled="!isCustomRules"
          :placeholder="placeholder"
          rows="5"
          @input="handleCustomQuery"
        >
        </textarea>
        <pre
          v-else
          v-highlightjs="customQuery ? customQuery.replaceAll('\\', '') : placeholder"
        ><code class="sql"></code></pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, PropType, Ref, ref, watch } from 'vue';

import DropDownSimple from '~/components/shared/drop-down-simple.vue';
import Icon from '~/components/shared/icon.vue';
import Input from '~/components/shared/input.vue';
import Tabs from '~/components/shared/tabs.vue';
import { MSSQL_PREFIX } from '~/constants';
import { DataI, SaveSettingModule } from '~/store/modules/save-setting';
import { DataBaseTypes } from '~/types/data-base-type';
import { parsePostgreSQLQueryByCustomFileterWithLimit } from '~/utils/parseQueryBuilder';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
}
// @Component({

// })
// PrismEditor
export default defineComponent({
  name: 'QueryGenerator',
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { DropDownSimple, Input, Icon, Tabs },
  props: {
    curentKey: {
      type: Number,
      required: true,
    },
    dataNumber: {
      type: Number,
      required: true,
    },
    fields: {
      type: null as any,
      required: true,
    },
    curentTable: {
      type: String,
      required: true,
    },
    typeDataBase: {
      type: String as PropType<DataBaseTypes>,
      required: true,
    },
  },
  // @Prop({ type: Number }) readonly curentKey!: number;
  // @Prop({ type: Array }) readonly fields!: Array<Field>;
  // @Prop({ type: String }) readonly curentTable!: string;
  // @Prop({ type: String }) readonly typeDataBase!: DataBaseTypes;
  setup(props, { emit }) {
    const value = ref('');
    const rule = ref('');
    const field = ref('');
    const customQuery: Ref<string> = ref('');
    const lineWithRules = ref([1]);
    const isAnd = ref(false);
    const isCustomRules = ref(false);
    const batchStart: Ref<string> = ref('0');
    const batchSize: Ref<string> = ref('500');
    const localTypeDataBase = ref(props.typeDataBase);
    const localCurentTable = ref(props.curentTable);

    const query: Ref<Array<Query>> = ref([
      {
        role: '',
        field: '',
        typeField: '',
        value: '',
      },
    ]);

    onMounted(() => {
      if (SaveSettingModule.export) {
        const data = SaveSettingModule.dataT[props.dataNumber];
        isAnd.value = data.CombinationQfQueries == 'AND';
        lineWithRules.value = data.QuerySettings.map((item, index) => index + 1);
        query.value = data.QuerySettings.map(item => ({
          role: item.Operator,
          field: item.Field,
          typeField: '',
          value: item.Value,
        }));
        batchStart.value = data.Batch.Start;
        batchSize.value = data.Batch.End;
      }
      emit('query-loaded', true);
    });

    function highlighter(code: any) {
      // eslint-disable-next-line no-console
      console.log('code', code);
      // return highlight(code, languages.js);
      //returns html
    }

    function queryModel() {
      return customQuery.value ? customQuery.value.replaceAll('\\', '') : placeholder.value;
    }

    function genereteQuery(): void {
      const cmd = parsePostgreSQLQueryByCustomFileterWithLimit({
        logicalOperator: isAnd.value ? 'AND' : 'OR',
        children: query.value,
        batchStart: batchStart.value,
        batchSize: batchSize.value,
        DBtype: props.typeDataBase,
      });
      // if (this.customQuery) {
      // }
      if (cmd.length) {
        if (props.typeDataBase === DataBaseTypes.PostgreSQL) {
          customQuery.value = `SELECT * FROM \\"${props.curentTable}\\" ${cmd}`;
          updateQuery(`SELECT * FROM \\"${props.curentTable}\\" ${cmd}`);
        } else if (props.typeDataBase === DataBaseTypes.MSSQL) {
          // eslint-disable-next-line no-console
          console.log('2', cmd);
          customQuery.value = `SELECT * FROM ${MSSQL_PREFIX}.${props.curentTable} ${cmd}`;
          updateQuery(`SELECT * FROM ${MSSQL_PREFIX}.${props.curentTable} ${cmd}`);
        } else {
          // eslint-disable-next-line no-console
          console.log('3', cmd);
          customQuery.value = `SELECT * FROM ${props.curentTable} ${cmd}`;
          updateQuery(`SELECT * FROM ${props.curentTable} ${cmd}`);
        }
      } else {
        if (props.typeDataBase === DataBaseTypes.PostgreSQL) {
          // eslint-disable-next-line no-console
          console.log('4');
          customQuery.value = `SELECT * FROM \\"${props.curentTable}\\"  LIMIT ${batchSize.value} OFFSET ${batchStart.value}`;
          updateQuery(
            `SELECT * FROM \\"${props.curentTable}\\" LIMIT ${batchSize.value} OFFSET ${batchStart.value}`,
          );
        } else if (props.typeDataBase === DataBaseTypes.MSSQL) {
          // eslint-disable-next-line no-console
          console.log('5');
          customQuery.value = `SELECT * FROM ${MSSQL_PREFIX}.${
            props.curentTable
          } WHERE id BETWEEN ${batchStart.value} AND ${+batchSize.value + +batchStart.value}`;
          updateQuery(
            `SELECT * FROM ${MSSQL_PREFIX}.${props.curentTable} WHERE id BETWEEN ${
              batchStart.value
            } AND ${+batchSize.value + +batchStart.value}`,
          );
        } else {
          // eslint-disable-next-line no-console
          console.log('6');
          customQuery.value = `SELECT * FROM ${props.curentTable}  LIMIT ${batchSize.value} OFFSET ${batchStart.value}`;
          updateQuery(
            `SELECT * FROM ${props.curentTable}  LIMIT ${batchSize.value} OFFSET ${batchStart.value}`,
          );
        }
      }
    }

    function checkRulesByTypeJSON(typeField: string | any) {
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

    const exportc: ComputedRef<boolean> = computed(() => {
      return SaveSettingModule.export;
    });

    const fieldsLabel: ComputedRef<Array<string>> = computed(() => {
      return props.fields.map((item: any) => item.label);
    });

    const dataWithKey: ComputedRef<DataI> = computed(() => {
      // eslint-disable-next-line no-console
      console.log(SaveSettingModule.dataT);
      return SaveSettingModule.dataT[props.dataNumber];
    });

    const placeholder: ComputedRef<string> = computed(() => {
      if (props.typeDataBase === DataBaseTypes.PostgreSQL) {
        console.log('ph postgresql');
        return `SELECT * FROM "${props.curentTable}" LIMIT ${batchSize.value} OFFSET  ${batchStart.value}`;
      } else if (props.typeDataBase === DataBaseTypes.MSSQL) {
        console.log(
          'ph mssql =',
          `SELECT * FROM ${MSSQL_PREFIX}.${props.curentTable} WHERE id BETWEEN ${
            batchStart.value
          } AND ${+batchSize.value + +batchStart.value}`,
        );
        return `SELECT * FROM ${MSSQL_PREFIX}.${props.curentTable} WHERE id BETWEEN ${
          batchStart.value
        } AND ${+batchSize.value + +batchStart.value}`;
      } else {
        console.log(
          'mysql',
          `SELECT * FROM ${props.curentTable} LIMIT ${batchSize.value} OFFSET  ${batchStart.value}`,
        );
        return `SELECT * FROM ${props.curentTable} LIMIT ${batchSize.value} OFFSET  ${batchStart.value}`;
      }
    });

    watch(exportc, value => {
      if (value) {
        const data = SaveSettingModule.dataT[props.dataNumber];
        isAnd.value = data.CombinationQfQueries == 'AND';
        lineWithRules.value = data.QuerySettings.map((item, index) => index + 1);
        query.value = data.QuerySettings.map(item => ({
          role: item.Operator,
          field: item.Field,
          typeField: '',
          value: item.Value,
        }));
        batchStart.value = data.Batch.Start;
        batchSize.value = data.Batch.End;
      }
    });

    watch(isCustomRules, () => {
      SaveSettingModule.setIsCustomQuery({ key: props.dataNumber, val: isCustomRules.value });
      // this.genereteQuery();
    });

    function handleRules(role: string, index: number): void {
      const newQuery = query.value;
      newQuery[index].role = role;
      query.value = [...newQuery];
      SaveSettingModule.setQuerySettingsOperation({ key: props.dataNumber, id: index, val: role });
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

    function handleIsAnd(): void {
      isAnd.value = !isAnd.value;
      genereteQuery();
      SaveSettingModule.setCombinationQfQueries({
        key: props.dataNumber,
        val: isAnd.value ? 'AND' : 'OR',
      });
    }

    function handleCustomQuery(e: any): void {
      // console.log("@input=", e.target.value);
      let temp = JSON.parse(JSON.stringify(e.target.value));
      temp = JSON.parse(JSON.stringify(temp)).replace(/(["])/g, '\\$1');
      // eslint-disable-next-line no-console
      console.log('handleCustomQuery', temp);
      customQuery.value = e.target.value;
      SaveSettingModule.setCustomQuery({ key: props.dataNumber, val: temp });
      updateQuery(temp);
    }

    function handleFields(field: string, index: number): void {
      const newQuery = query.value;
      newQuery[index].field = field;
      newQuery[index].typeField = props.fields.filter((item: any) => item.label === field)[0].type;
      query.value = [...newQuery];
      SaveSettingModule.setQuerySettingsField({ key: props.dataNumber, id: index, val: field });
      // this.$forceUpdate()
    }

    function handleInput(value: string, index: number): void {
      const newQuery = query.value;
      newQuery[index].value = value;
      query.value = [...newQuery];
      SaveSettingModule.setQuerySettingsVal({ key: props.dataNumber, id: index, val: value });
    }

    function handlebatchSize(value: any): void {
      batchSize.value = value.target.value;
      genereteQuery();
      SaveSettingModule.setBatch({
        key: props.dataNumber,
        data: {
          Start: batchStart.value,
          End: batchSize.value,
        },
      });
    }

    function handlebatchStart(value: any): void {
      batchStart.value = value.target.value;
      genereteQuery();
      SaveSettingModule.setBatch({
        key: props.dataNumber,
        data: {
          Start: batchStart.value,
          End: batchSize.value,
        },
      });
    }

    function close(id: number): void {
      lineWithRules.value.splice(id, 1);
      query.value.splice(id, 1);
      SaveSettingModule.deleteQuerySettings({ key: props.dataNumber, id });
    }

    function add(): void {
      lineWithRules.value.push(lineWithRules.value[lineWithRules.value.length - 1] + 1);
      query.value.push({} as Query);
      SaveSettingModule.addNewFilterLine({ key: props.dataNumber });
    }

    function updateQuery(query: string): string {
      emit('update-query', query);
      return query;
    }

    watch(query, () => {
      genereteQuery();
    });

    watch(localTypeDataBase, () => {
      genereteQuery();
    });

    watch(localCurentTable, () => {
      query.value = [
        {
          role: '',
          field: '',
          typeField: '',
          value: '',
        },
      ];
      genereteQuery();
    });
    return {
      updateQuery,
      add,
      close,
      handlebatchStart,
      handlebatchSize,
      handleInput,
      handleFields,
      handleCustomQuery,
      handleIsAnd,
      getRules,
      disabledValue,
      handleRules,
      placeholder,
      dataWithKey,
      fieldsLabel,
      checkRulesForDisableInput,
      checkRulesByTypeJSON,
      genereteQuery,
      queryModel,
      highlighter,
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
      localTypeDataBase,
      localCurentTable,
    };
  },
});
</script>

<style module lang="scss">
.query-bilder {
  display: flex;
  justify-content: space-between;
  // align-items: center;
  align-content: center;
  flex-direction: row;
}

.disabled {
  color: #bdbdbd;
  border: 3px solid #cacaca;
}
.mb5 {
  margin-bottom: 5px;
}

.hover {
  cursor: pointer;
  margin-bottom: 25px;
  margin-left: 2px;
}
textarea {
  width: 100%;
  border: 3px solid green;
  padding: 2px;
}
code {
  height: 150px;
  width: 100%;
  border: 3px solid;
  // word-break: break-word;
}

pre {
  white-space: pre-wrap;
}
.query-bilder > .container {
  margin-bottom: 25px;
}
.customLabel{
  margin-bottom: 7px !important;
}
</style>
