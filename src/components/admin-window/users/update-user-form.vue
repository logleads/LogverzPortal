<template>
  <div :class="$style['form']" @click="handleShowForm($event, false)">
    <div :class="$style['form__body']" @click="handleBodyClick($event)">
      <div :class="$style['container']">
        <span :class="$style['container__key']">Name:</span>
        <span :class="$style['container__value']">
          {{ name }}
        </span>
      </div>
      <div :class="$style['container']">
        <span :class="$style['container__key']">Type:</span>
        <span :class="$style['container__value']">
          {{ type }}
        </span>
      </div>
      <div :class="$style['select-container']">
        <h1>Groups</h1>
        <multiselect
          v-model="chosenGroup"
          name="chosenGroup"
          :options="groups"
          :multiple="true"
          :close-on-select="true"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Select option"
          open-direction="bottom"
          label="name"
          track-by="name"
          :class="{ invalid: submitted && v$.chosenGroup.$invalid }"
        />
      </div>
      <div :class="$style['select-container']">
        <h1>Policies</h1>
        <multiselect
          v-model="chosenPolicies"
          name="chosenPolicies"
          :options="policies"
          :multiple="true"
          :close-on-select="true"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Select option"
          open-direction="bottom"
          label="name"
          track-by="name"
          :class="{ invalid: submitted && v$.chosenGroup.$invalid }"
        />
      </div>
      <div :class="$style['button-container']">
        <Button text="Save" @click="handleSubmit" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import { useVuelidate } from '@vuelidate/core';
// import { required } from '@vuelidate/validators';
import { computed, ComputedRef, defineComponent, Ref, ref } from 'vue';
import Multiselect from 'vue-multiselect';

import Button from '~/components/shared/button.vue';
import { AdminModule } from '~/store/modules/admin';

export default defineComponent({
  name: 'UpdateUserForm',
  components: {
    Button,
    Multiselect,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    prevGroups: {
      type: Array,
      required: true,
    },
    prevPolicies: {
      type: Array,
      required: true,
    },
  },

  // @Prop({ required: true, type: String }) readonly type!: string;
  // @Prop({ required: true, type: Array }) readonly prevGroups!: Array<{ name: string }>;
  // @Prop({ required: true, type: Array }) readonly prevPolicies!: Array<{ name: string }>;
  setup(props, { emit }) {
    const submitted: Ref<boolean> = ref(false);
    const chosenGroup = ref(props.prevGroups);
    const chosenPolicies = ref(props.prevPolicies);
    const rules = {
      // chosenGroup: { required },
    };
    // const v$ = useVuelidate(rules, { chosenGroup });

    const groups: ComputedRef<Array<{ name: string }>> = computed(() => {
      return AdminModule.groups.map(i => ({ name: i.Name }));
    });
    const policies: ComputedRef<Array<{ name: string }>> = computed(() => {
      return AdminModule.policies.map(i => ({ name: i.Name }));
    });

    function handleSubmit(): void {
      submitted.value = true;
      emit('toggleForm', false);
      AdminModule.updateUser({
        Name: props.name,
        type: props.type,
        IAMGroups: chosenGroup.value.map((i: any) => i.name),
        IAMPolicies: chosenPolicies.value.map((i: any) => i.name),
      });
    }

    function handleBodyClick(e: Event): void {
      e.stopPropagation();
    }
    function handleShowForm(e: Event, value: boolean): void {
      e.stopPropagation();
      emit('toggleForm', value);
    }
    return {
      handleShowForm,
      handleBodyClick,
      handleSubmit,
      policies,
      groups,
      chosenPolicies,
      chosenGroup,
      submitted,
      rules,
      // v$,
      emit,
    };
  },
});
</script>

<style module lang="scss">
.form {
  position: absolute;
  z-index: 2;
  width: 120%;
  height: 110%;
  background-color: rgba(43, 42, 44, 0.4);
  top: 0;
  right: -20px;
  transform: translate(0, -9%);

  &__body {
    position: absolute;
    z-index: 4;
    top: 50%;
    right: 50%;
    transform: translate(64%, -74%);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    width: 55%;
    height: 55%;
    padding: 40px;
    background-color: var(--gray-background);
  }
}
.container {
  margin: 15px 0;

  &__key {
    font-size: 15px;
    color: var(--accent-color);
  }

  &__value {
    font-size: 14px;
    color: #000000;
  }
}

.select-container {
  margin-bottom: 15px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
}
</style>
