<template>
  <div class="form" @click="handleShowForm($event, false)">
    <div class="form__body" @click="handleBodyClick($event)">
      <template v-if="fetching">
        <Loader accent />
      </template>
      <template v-else>
        <h3>Add or Remove Logverz Policies</h3>
        <div class="input-wrapper__multi">
          <template v-if="usersPoliciesFetching">
            <Loader accent />
          </template>
          <template v-else>
            <div class="multiselect-wrapper">
              <multiselect v-model="chosenPolicyUsers" name="chosenUsers" :options="allPoliciesLGVZ" :multiple="true"
                :close-on-select="true" :clear-on-select="false" :preserve-search="true" placeholder="Select option"
                label="name" open-direction="bottom" track-by="name" />
              <!-- <h3>Add or Remove External users</h3> -->

              <!-- <multiselect v-model="chosenUsers" name="Users" :options="users" :multiple="true" :close-on-select="true"
                :clear-on-select="false" :preserve-search="true" placeholder="Select option" label="name"
                open-direction="bottom" track-by="name" /> -->

            </div>
          </template>
        </div>
        <div class="button-container">
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
import { AdminWindowService } from '~/services/api/admin-window-service';
import { AdminModule } from '~/store/modules/admin';
import { userResponse } from '~/types/models/admin-window-types';

export default defineComponent({
  name: 'RolesForm',
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
    const chosenPolicyUsers: Ref<Array<{ name: string, type: string, associations: string[], document: string }>> = ref([]);
    const chosenUsers: Ref<Array<{ name: string, type: string,IAMGroups:string[]
     }>> = ref([]);
     
    const fetching: Ref<boolean> = ref(false);
    const submitted: Ref<boolean> = ref(false);
    const allPoliciesLGVZ: Ref<Array<{ name: string, type: string, associations: string[], document: string }>> = ref([])

    const usersOfPolicy: ComputedRef<userResponse[]> = computed(() => {
      return AdminModule.usersOfPolicies[props.currentPolicyName]?.filter(
        (i: userResponse) => i.Type !== 'UserAWS',
      );
    });

    watch(usersOfPolicy, (value: any) => {
      chosenPolicyUsers.value = value.map(i => ({ name: i.Name, type: i.Type, associations: i.LatestVersion?.document, IAMGroups: i.IAMGroups }));
    });

    const usersPoliciesFetching: ComputedRef<boolean> = computed(() => {
      return AdminModule.usersPoliciesFetching[props.currentPolicyName];
    });


    const usersNotAWS: ComputedRef<userResponse[]> = computed(() => {
      return AdminModule.usersNotAWS;
    });
    onMounted(async () => {
      await AdminModule.getUserOfPolicy(props.currentPolicyName);
      const data = await AdminWindowService.getPolicies('PolicyLGVZ');
      allPoliciesLGVZ.value = data.map((i) => ({ name: i.Name, type: i.Type, associations: i?.Associations, document: i.LatestVersion?.Document || '' }))

    });

    function handleBodyClick(e: Event): void {
      e.stopPropagation();
    }

    function handleShowForm(e: Event, value: boolean): void {
      e.stopPropagation();
      emit('toggleForm', value);
    }

    const users = computed(() =>
      AdminModule.users.map(i => ({
        name: i.Name,
        type: i.Type,
        IAMGroups: i.IAMGroups

      }))
    );

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
      if (chosenPolicyUsers.value.length > 0) {
        const groups: string[] = [];
        chosenUsers.value?.forEach((item) => {
          if (Array.isArray(item.IAMGroups)) {
            groups.push(...item.IAMGroups);
          }
        });



        chosenPolicyUsers.value.map((item) => {
          const payload = {
            Name: item.name,
            Type: item?.type,
            Document: item?.document,
            Associations: [...item?.associations, props.currentPolicyName + ':RoleAWS'],
          }; 
                   
          AdminModule.createPolicy(payload);

        })

      }

      AdminModule.getUserOfPolicy(props.currentPolicyName);

      emit('toggleForm', false);
    }
    return {
      handleSubmit,
      handleShowForm,
      handleBodyClick,
      usersNotAWS,
      allPoliciesLGVZ,
      usersPoliciesFetching,
      usersOfPolicy,
      submitted,
      fetching,
      chosenPolicyUsers,
      chosenUsers,
      users,
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

.input-wrapper {
  margin-bottom: 15px;

  &__multi {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

.multiselect-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
}
</style>
