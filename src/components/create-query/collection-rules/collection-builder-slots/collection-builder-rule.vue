<template>
  <!-- eslint-disable vue/no-v-html -->
  <div :class="$style['rule-container']">
    <div :class="$style['rule-header']"></div>
    <div :class="$style['input-container']">
      <!-- List of operands (optional) -->
      <div :class="[$style['input-container__item'], $style['label']]">
        <label :class="$style['rule-header__label']">{{ rule.label }}</label>
      </div>
      <div
        v-if="typeof rule.operands !== 'undefined'"
        :class="[$style['input-container__item'], $style['replace-margin']]"
      >
        <DropDownInput
          :items="rule.operands"
          :selected-field="query.operand"
          :expanded="selects[0]"
          @expand="handleExpand(0)"
          @select="selectOptionalOperand"
        />
      </div>

      <!-- List of operators (e.g. =, !=, >, <) -->
      <div
        v-if="typeof rule.operators !== 'undefined' && rule.operators.length > 1"
        :class="[$style['input-container__item'], $style['replace-margin']]"
      >
        <DropDownInput
          :items="rule.operators"
          :selected-field="query.operator"
          :expanded="selects[1]"
          @expand="handleExpand(1)"
          @select="selectBaseOperator"
        />
      </div>

      <!-- Basic text input -->
      <div v-if="rule.inputType === 'text'" :class="$style['input-container__item']">
        <Input v-model="query.value" type="text" :placeholder="labels.textInputPlaceholder" />
      </div>

      <!-- Radio input -->
      <div
        v-if="rule.inputType === 'radio'"
        :class="[$style['input-container__item'], $style['radio-input-container']]"
      >
        <div v-for="choice in rule.choices" :key="choice.value" :class="$style['radio-input']">
          <input
            :id="'depth' + depth + '-' + rule.id + '-' + index + '-' + choice.value"
            v-model="query.value"
            :name="'depth' + depth + '-' + rule.id + '-' + index"
            type="radio"
            :value="choice.value"
          />
          <label
            :class="$style['radio-input__label']"
            :for="'depth' + depth + '-' + rule.id + '-' + index + '-' + choice.value"
            >{{ choice.label }}</label
          >
        </div>
      </div>
      <div :class="[$style['input-container-item'], $style['close-icon']]" @click="remove">
        <Icon type="button" name="x-mark" :width="30" :height="30" />
      </div>
    </div>
  </div>
</template>

<script>
import QueryBuilderRule from 'vue-query-builder/dist/rule/QueryBuilderRule.umd.js';

import DropDownInput from '~/components/shared/drop-down-input.vue';
import Icon from '~/components/shared/icon.vue';
import Input from '~/components/shared/input.vue';

export default {
  name: 'QueryBuilderRule',
  components: {
    Icon,
    DropDownInput,
    Input,
  },
  extends: QueryBuilderRule,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  data() {
    return {
      selects: [false, false],
    };
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handleExpand(id) {
      this.selects = this.selects.map((item, i) => (i === id ? !item : item));
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    selectOptionalOperand(item) {
      this.query.operand = item;
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    selectBaseOperator(item) {
      this.query.operator = item;
    },
  },
};
</script>

<style module lang="scss">
.rule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__label {
    margin-left: 20px;
    font-weight: 500;
    font-size: 12px;
  }
}

.basic-text {
  margin-bottom: 12px;
}

.radio-input {
  margin: 12px 7px;
  display: flex;
  align-items: center;

  &__label {
    font-weight: 500;
    font-size: 13px;
    margin-left: 20px;
  }
}

.input-container {
  width: 100%;
  display: flex;
  align-items: center;
  &__item {
    width: 30%;
    margin-right: 30px;
  }
}
.replace-margin {
  input {
    margin: 0;
  }
}

.close-icon {
  cursor: pointer;
}

.radio-input-container {
  display: flex;
}

.rule-container {
  margin-top: 23px;
  margin-bottom: 13px;
  background-color: var(--gray-background);
  border-radius: 5px;
  padding: 21.5px 30px 25.5px 30px;
}

.label {
  width: auto;
}
</style>
