<template>
  <div :class="$style['advanced']">
    <template v-if="!isFetching">
      <div v-for="input in inputs" :key="input.label" :class="$style['advanced__inputs']">
        <InputContainer :label="input.label">
          <template #icon>
            <ToolTip :tip="input.tip" />
          </template>
          <template #input>
            <Input
              v-model="input.content"
              :name="input.label"
              :error="submitted && v$[input.label].$error"
              @input="handleInput({ value: $event, label: input.label })"
            />
          </template>
        </InputContainer>
        <div v-if="submitted && v$[input.label].$error" :class="$style['validation-text']">
          {{ input.label }} is required
        </div>

        <div v-if="submitted && v$[input.label].between" :class="$style['validation-text']">
          {{ input.label }} Must be between
          {{ v$[input.label].between.$params.min }}
          -
          {{ v$[input.label].between.$params.max }}
        </div>
      </div>
      <div :class="$style['advanced__inputs']">
        <label :class="$style['label']">
          <span :class="$style['label__text']">AllocationStrategy</span>
          <ToolTip :tip="DCH_ALLOCATION_STRATEGY_LOCAL" />
        </label>
        <DropDownSimple
          :content="AllocationStrategy"
          :items="items"
          name="AllocationStrategy"
          @select-value="handleInputSelect"
        />
      </div>
    </template>
    <template v-else>
      <Loader />
    </template>
  </div>
</template>

<script lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { between, required } from '@vuelidate/validators';
import { computed, defineComponent, onMounted, Ref, ref, WritableComputedRef } from 'vue';

import DropDownSimple from '~/components/shared/drop-down-simple.vue';
import Input from '~/components/shared/input.vue';
import InputContainer from '~/components/shared/input-container.vue';
import Loader from '~/components/shared/loader.vue';
import ToolTip from '~/components/shared/tool-tip.vue';
import {
  DCH_ALLOCATION_STRATEGY,
  DCH_PREFERRED_WORKED_NUMBER,
  DCH_S3_ENUMERATION_DEPTH,
} from '~/constants';
import { DataCollectionModule } from '~/store/modules/data-collection';

export default defineComponent({
  name: 'AdvancedSettings',
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { ToolTip, Loader, InputContainer, Input, DropDownSimple },
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
    const items: string[] = ['cost-sensitive', 'balanced', 'time-sensitive'];
    const DCH_ALLOCATION_STRATEGY_LOCAL = DCH_ALLOCATION_STRATEGY;
    const rules = {
      S3EnumerationDepth: { required, between: between(0, 9) },
      PreferedWorkerNumber: { required },
      AllocationStrategy: { required },
    };

    const S3EnumerationDepth = computed(() => {
      return DataCollectionModule.s3EnumerationDepth;
    });

    const PreferedWorkerNumber = computed(() => {
      return DataCollectionModule.preferedWorkerNumber;
    });

    const AllocationStrategy: WritableComputedRef<string> = computed(() => {
      return DataCollectionModule.allocationStrategy;
    });

    const inputs: Ref<Array<{ label: string; content: string; tip: string }>> = ref([
      {
        label: 'S3EnumerationDepth',
        content: S3EnumerationDepth.value,
        tip: DCH_S3_ENUMERATION_DEPTH,
      },
      {
        label: 'PreferedWorkerNumber',
        content: PreferedWorkerNumber.value,
        tip: DCH_PREFERRED_WORKED_NUMBER,
      },
    ]);

    const v$ = useVuelidate(rules, {
      S3EnumerationDepth,
      PreferedWorkerNumber,
      AllocationStrategy,
    });

    onMounted(() => {
      // emit('validate', v$);
    });

    function handleInput(payload: { value: string; label: string }): void {
      DataCollectionModule.setInputValue(payload);
      v$.value.$touch();
      emit('validate', v$);
    }

    function handleInputSelect(payload: { item: string; content: string }): void {
      DataCollectionModule.setSelectValue({ label: 'AllocationStrategy', value: payload.item });
      v$.value.$touch();
      emit('validate', v$);
    }
    return {
      handleInput,
      handleInputSelect,
      inputs,
      AllocationStrategy,
      PreferedWorkerNumber,
      S3EnumerationDepth,
      DCH_ALLOCATION_STRATEGY_LOCAL,
      items,
      v$,
    };
  },
});
</script>

<style module lang="scss">
.advanced {
  margin-top: 23px;
  background-color: var(--gray-background);
  border-radius: 5px;
  padding: 26px 0 24px 20px;

  &__inputs {
    max-width: 99%;
    input {
      height: 42px;
    }

    > div {
      margin-bottom: 20px;
    }
  }
}
.error {
  border-color: red;
}

.validation-text {
  color: red;
  font-size: 12px;
  margin-top: -10px;
}

.label {
  display: flex;
  align-content: center;

  &__text {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
    margin-right: 7px;
  }

  &__icon {
    color: var(--accent-color);
  }
}
</style>
