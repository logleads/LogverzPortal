<template>
  <div class="advanced">
    <template v-if="!isFetching">
      <div v-for="input in inputs" :key="input.label" class="advanced__inputs">
        <InputContainer :label="input.label">
          <template #icon>
            <ToolTip :tip="input.tip" />
          </template>
          <template #input>
            <Input v-model="input.content" :name="input.label" :error="submitted && v$[input.label].$error"
              @input="handleInput({ value: $event?.target.value, label: input.label })" />
          </template>
        </InputContainer>
        <div v-if="submitted && v$[input.label].$error" class="validation-text">
          <template v-if="input.label === 'S3EnumerationDepth' && v$[input.label].validate.$invalid">
            S3EnumerationDepth must be a number between 0 and 9
          </template>
          <template v-else-if="input.label === 'PreferedWorkerNumber' && v$[input.label].validate.$invalid">
            PreferedWorkerNumber is required and cannot be empty
          </template>
          <template v-else>
            {{ input.label }} is required
          </template>
        </div>

        <div v-if="submitted && v$[input.label].between" class="validation-text">
          {{ input.label }} Must be between
          {{ v$[input.label].between.$params.min }}
          -
          {{ v$[input.label].between.$params.max }}
        </div>
      </div>
      <div class="advanced__inputs">
        <label class="label">
          <span class="label__text">AllocationStrategy</span>
          <ToolTip :tip="DCH_ALLOCATION_STRATEGY_LOCAL" />
        </label>
        <DropDownSimple :content="AllocationStrategy" :items="items" name="AllocationStrategy"
          @select-value="handleInputSelect" />
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
import { computed, defineComponent, onMounted, Ref, ref, WritableComputedRef, watch } from 'vue';

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
    const validateS3Depth = (value: string) => {
      const num = parseInt(value);
      return !isNaN(num) && num >= 0 && num <= 9;
    };

    const validatePreferedWorker = (value: string) => {
      return value && value.trim().length > 0;
    };

    const rules = {
      S3EnumerationDepth: { required, validate: validateS3Depth },
      PreferedWorkerNumber: { required, validate: validatePreferedWorker },
      AllocationStrategy: { required },
    };

    const S3EnumerationDepth = computed(() => {
      return DataCollectionModule.s3EnumerationDepth;
    });

    const PreferedWorkerNumber = computed(() => {
      return DataCollectionModule.preferedWorkerNumber;
    });

    // const AllocationStrategy: WritableComputedRef<string> = computed(() => {
    //   return DataCollectionModule.allocationStrategy;
    // });
    const AllocationStrategy: WritableComputedRef<string> = computed({
      get: () => DataCollectionModule.allocationStrategy,
      set: (value: string) => {
        DataCollectionModule.allocationStrategy = value;
      }
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

    watch(() => props.submitted, (newVal) => {
      if (newVal) {
        v$.value.$touch();
        emit('validate', v$);
      }
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

<style scoped lang="scss">
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

    >div {
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
