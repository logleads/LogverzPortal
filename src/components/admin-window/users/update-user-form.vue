<template>
  <div class="form" @click="handleShowForm($event, false)">
    <div class="form__body" @click="handleBodyClick($event)">
      <div class="container">
        <span class="container__key">Name: </span>
        <span class="container__value">
          {{ name }}
        </span>
      </div>
      <div class="container">
        <span class="container__key">Type: </span>
        <span class="container__value">
          {{ type }}
        </span>
      </div>
      <div class="select-container">
        <h3 class="label-heading">Groups</h3>
        <multiselect v-model="chosenGroup" name="chosenGroup" :options="groups" :multiple="true" :close-on-select="true"
          :clear-on-select="false" :preserve-search="true" placeholder="Select option" open-direction="bottom"
          label="name" track-by="name" :class="{ invalid: submitted && v$.chosenGroup.$error }" />
      </div>
      <div class="select-container">
        <h3 class="label-heading">Policies</h3>
        <multiselect v-model="chosenPolicies" name="chosenPolicies" :options="policies" :multiple="true"
          :close-on-select="true" :clear-on-select="false" :preserve-search="true" placeholder="Select option"
          open-direction="bottom" label="name" track-by="name"
          :class="{ invalid: submitted && v$.chosenGroup.$error }" />
      </div>
      <div class="button-container">
        <Button text="Save" @click="handleSubmit" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, ComputedRef, defineComponent, nextTick, onMounted, Ref, ref } from 'vue';
import Multiselect from 'vue-multiselect';

import Button from '~/components/shared/button.vue';
import { AdminWindowService } from '~/services/api/admin-window-service';
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
  setup(props, { emit }) {
    const submitted: Ref<boolean> = ref(false);
    const allPoliciesLGVZ: Ref<Array<{ name: string }>> = ref([])

    const chosenGroup = ref(props.prevGroups);
    const chosenPolicies = ref(props.prevPolicies);
    const rules = {
      chosenGroup: { required },
    };
    const v$ = useVuelidate(rules, { chosenGroup });

    const groups: ComputedRef<Array<{ name: string }>> = computed(() => {
      return AdminModule.groups.map(i => ({ name: i.Name }));
    });
    const policies: ComputedRef<Array<{ name: string }>> = computed(() => {
      return AdminModule.policies.map(i => ({ name: i.Name }));
    });
    onMounted(async () => {
      const data = await AdminWindowService.getPolicies('PolicyLGVZ');
      allPoliciesLGVZ.value = data.map((i) => ({ name: i.Name }))

    });


    function handleSubmit(): void {
      submitted.value = true;
      v$.value.$touch();
      if (!v$.value.chosenGroup.$error) {
        emit('toggleForm', false);
        const logverzPolicies = chosenPolicies.value?.filter((chosenPolicy: any) =>
          allPoliciesLGVZ.value.some((lgvzPolicy) => lgvzPolicy.name === chosenPolicy?.name)
        );

        const othersPolicies = chosenPolicies.value.filter(
          (chosenPolicy: any) =>
            !allPoliciesLGVZ.value.some(
              (lgvzPolicy) => lgvzPolicy.name === chosenPolicy.name
            )
        );



        AdminModule.updateUser({
          Name: props.name,
          type: props.type,
          IAMGroups: chosenGroup.value.map((i: any) => i.name),
          IAMPolicies: othersPolicies?.map((i: any) => i.name),
        });
        
        if (logverzPolicies.length > 0) {
          logverzPolicies?.map((i: any) => {

            AdminModule.updateUser2({
              Name: props.name,
              type: props.type,
              IAMGroups: chosenGroup.value.map((i: any) => i.name),
              AppScopeAuth: { Policies: i.name }
            });
          })
        }

        resetForm();
      }
    }
    const resetForm = () => {
      chosenGroup.value = [...props.prevGroups];
      chosenPolicies.value = [...props.prevPolicies];
      submitted.value = false;
      v$.value.$reset();
    };
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
      v$,
      emit,
    };
  },
});
</script>

<style scoped lang="scss">
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

.label-heading {
  margin-bottom: 5px;
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

.container__key {
  color: #000000;
  font-weight: 700;
}
</style>
