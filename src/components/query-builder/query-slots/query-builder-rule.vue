<template>
  <div>
    <div>
      <div :class="$style['rule-header']">
        <label :class="$style['rule-header__label']">{{ rule.label }}</label>
        <div :class="$style['rule-header__close']" @click="remove">
          <Icon type="button" name="x-mark" :width="30" :height="30" />
        </div>
      </div>

      <!-- List of operands (optional) -->
      <DropDownInput
        v-if="typeof rule.operands !== 'undefined'"
        :items="rule.operands"
        :selected-field="query.operand"
        :expanded="selects[0]"
        @expand="handleExpand(0)"
        @select="selectOptionalOperand"
      />

      <!-- List of operators (e.g. =, !=, >, <) -->
      <DropDownInput
        v-if="typeof rule.operators !== 'undefined' && rule.operators.length > 1"
        :items="rule.operators"
        :selected-field="query.operator"
        :expanded="selects[1]"
        @expand="handleExpand(1)"
        @select="selectBaseOperator"
      />

      <!-- Basic text input -->
      <div :class="$style['basic-text']">
        <Input
          v-if="rule.inputType === 'text'"
          v-model="query.value"
          type="text"
          :placeholder="labels.textInputPlaceholder"
        />
      </div>

      <!-- Radio input -->
      <template v-if="rule.inputType === 'radio'">
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
      </template>
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

  &__close {
    cursor: pointer;
  }

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
  margin: 12px 0;
  display: flex;
  align-items: center;

  &__label {
    font-weight: 500;
    font-size: 13px;
    margin-left: 20px;
  }
}
</style>
