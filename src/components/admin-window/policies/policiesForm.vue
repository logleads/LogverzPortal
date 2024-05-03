<template>
  <div :class="$style['form']" @click="handleShowForm($event, false)">
    <div :class="$style['form__body']" @click="handleBodyClick($event)">
      <template v-if="fetching">
        <Loader accent />
      </template>
      <template v-else>
        <h1>Add or remove external users</h1>
        <div :class="$style['input-wrapper__multi']">
          <template v-if="usersPoliciesFetching">
            <Loader accent />
          </template>
          <template v-else>
            <multiselect
              v-model="chosenPolicyUsers"
              name="chosenUsers"
              :options="usersNotAWSMultiSelect"
              :multiple="true"
              :close-on-select="true"
              :clear-on-select="false"
              :preserve-search="true"
              placeholder="Select option"
              label="name"
              open-direction="bottom"
              track-by="name"
            />
          </template>
        </div>
        <div :class="$style['button-container']">
          <Button text="Save" @click="handleSubmit" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref, watch } from 'vue';
import Multiselect from 'vue-multiselect';

import Button from '~/components/shared/button.vue';
import Loader from '~/components/shared/loader.vue';
import { AdminModule } from '~/store/modules/admin';
import { userResponse } from '~/types/models/admin-window-types';

export default defineComponent({
  name: 'PoliciesForm',
  components: {
    Button,
    Loader,
    Multiselect,
  },
  props: {
    currentPolicyName: {
      type: String,
      required: true,
    },
  },

  // @Prop({ required: true, type: String }) readonly currentPolicyName!: string;
  setup(props, { emit }) {
    const chosenPolicyUsers: Ref<Array<{ name: string }>> = ref([]);

    const fetching: Ref<boolean> = ref(false);
    const submitted: Ref<boolean> = ref(false);

    const usersOfPolicy: ComputedRef<userResponse[]> = computed(() => {
      return AdminModule.usersOfPolicies[props.currentPolicyName]?.filter(
        (i: userResponse) => i.Type !== 'UserAWS',
      );
    });

    watch(usersOfPolicy, (value: userResponse[]) => {
      chosenPolicyUsers.value = value.map(i => ({ name: i.Name }));
    });

    const usersPoliciesFetching: ComputedRef<boolean> = computed(() => {
      return AdminModule.usersPoliciesFetching[props.currentPolicyName];
    });

    const usersNotAWSMultiSelect: ComputedRef<Array<{ name: string }>> = computed(() => {
      return AdminModule.usersNotAWS.map(i => ({ name: i.Name }));
    });

    const usersNotAWS: ComputedRef<userResponse[]> = computed(() => {
      return AdminModule.usersNotAWS;
    });
    onMounted(async () => {
      await AdminModule.getUserOfPolicy(props.currentPolicyName);
    });

    function handleBodyClick(e: Event): void {
      e.stopPropagation();
    }

    function handleShowForm(e: Event, value: boolean): void {
      e.stopPropagation();
      emit('toggleForm', value);
    }

    async function handleSubmit(): Promise<void> {
      submitted.value = true;
      const usersAfter = chosenPolicyUsers.value.map(i => i.name);
      const usersBefore = usersOfPolicy.value.map(i => i.Name);

      const deletedUsers = usersBefore.filter((item: any) => !usersAfter.includes(item));
      const addedUsers = usersAfter.filter((item: any) => !usersBefore.includes(item));
      fetching.value = true;

      if (deletedUsers.length) {
        for (const user of deletedUsers) {
          const selectedUser = usersNotAWS.value.filter(i => i.Name === user);
          if (selectedUser.length) {
            await AdminModule.updateUser({
              Name: user,
              type: selectedUser[0].Type,
              IAMGroups: selectedUser[0].IAMGroups,
              IAMPolicies:
                selectedUser[0].IAMPolicies?.filter(
                  (item: any) => item !== props.currentPolicyName,
                ) || [],
            });
          }
        }
      }
      if (addedUsers.length) {
        for (const user of addedUsers) {
          const selectedUser = usersNotAWS.value.filter(i => i.Name === user);
          if (selectedUser.length) {
            let restPolicies: Array<string> = [];
            if (selectedUser[0].IAMPolicies) {
              restPolicies = selectedUser[0].IAMPolicies;
            }
            await AdminModule.updateUser({
              Name: user,
              type: selectedUser[0].Type,
              IAMGroups: selectedUser[0].IAMGroups,
              IAMPolicies: [...restPolicies, props.currentPolicyName],
            });
          }
        }
      }
      fetching.value = false;
      AdminModule.getUserOfPolicy(props.currentPolicyName);

      emit('toggleForm', false);
    }
    return {
      handleSubmit,
      handleShowForm,
      handleBodyClick,
      usersNotAWS,
      usersNotAWSMultiSelect,
      usersPoliciesFetching,
      usersOfPolicy,
      submitted,
      fetching,
      chosenPolicyUsers,
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

.input-wrapper {
  margin-bottom: 15px;

  &__multi {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

.button-container {
  display: flex;
  justify-content: flex-end;
}
</style>
