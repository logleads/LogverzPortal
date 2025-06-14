<template>
  <div class="form" @click="handleShowForm($event, false)">
    <div class="form__body" @click="handleBodyClick($event)">
      <template v-if="fetching">
        <Loader accent />
      </template>
      <template v-else>
        <h3>Add or Remove Logverz Policies</h3>
        <div class="input-wrapper__multi">
          <template v-if="usersOfGroupFetching">
            <Loader accent />
          </template>
          <template v-else>
            <div class="multiselect-wrapper">
              <multiselect v-model="chosenPolicie" name="chosenUsers" :options="allPoliciesLGVZ" :multiple="true"
                :close-on-select="true" :clear-on-select="false" :preserve-search="true" placeholder="Select option"
                label="name" open-direction="bottom" track-by="name" />
              <h3>Add or Remove External users</h3>

              <multiselect v-model="chosenUsers" name="Users" :options="users" :multiple="true" :close-on-select="true"
                :clear-on-select="false" :preserve-search="true" placeholder="Select option" label="name"
                open-direction="bottom" track-by="name" />
            </div>
          </template>
        </div>
        <div class="button-container">
          <MyButton text="Save" @click="handleSubmit" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref, watch } from 'vue';
import Multiselect from 'vue-multiselect';

import MyButton from '~/components/shared/button.vue';
import Loader from '~/components/shared/loader.vue';
import { AdminWindowService } from '~/services/api/admin-window-service';
import { AdminModule } from '~/store/modules/admin';
import { userResponse } from '~/types/models/admin-window-types';
interface Policy {
  Name: string; // Assuming the 'Name' property from the API is actually called 'Name' and is a string
  // Add other properties from your API response here, if any
}

export default defineComponent({
  name: 'GroupsForm',
  components: {
    Loader,
    MyButton,
    Multiselect,
  },
  props: {
    currentGroupName: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const chosenUsers: Ref<Array<{ name: string, type: string, IAMGroups: string[] }>> = ref([]);
    const chosenPolicie: Ref<Array<{ name: string, type: string, associations: string[], document: string }>> = ref([]);

    const submitted: Ref<boolean> = ref(false);
    const fetching: Ref<boolean> = ref(false);
    const allPoliciesLGVZ: Ref<Array<{ name: string }>> = ref([])
    const usersOfGroup: ComputedRef<userResponse[]> = computed(() => {
      return AdminModule.usersOfGroups[props.currentGroupName]?.filter(
        (i: userResponse) => i.Type !== 'UserAWS',
      );
    });
    watch(usersOfGroup, (value: any) => {
      chosenUsers.value = value.map(i => ({ name: i.Name, type: i.Type, associations: i.LatestVersion?.document, IAMGroups: i.IAMGroups }));
    });
    //TODO: remove watch innotations
    // @Watch('usersOfGroup')
    // handleInitUsers(value: userResponse[]): void {
    //   this.chosenUsers = value.map(i => ({ name: i.Name }));
    // }
    const usersOfGroupFetching: ComputedRef<boolean> = computed(() => {
      return AdminModule.usersGroupsFetching[props.currentGroupName];
    });

    const usersNotAWS: ComputedRef<userResponse[]> = computed(() => {
      return AdminModule.usersNotAWS;
    });

    const users = computed(() =>
      AdminModule.users.map(i => ({
        name: i.Name,
        type: i.Type,
      }))
    );

    onMounted(async () => {
      await AdminModule.getUserOfGroup(props.currentGroupName);
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

    async function handleSubmit(): Promise<void> {
      submitted.value = true;

      const usersAfter = chosenUsers.value.map(i => i.name);
      const usersBefore = usersOfGroup.value.map(i => i.Name);

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
              IAMGroups: selectedUser[0].IAMGroups.filter(
                (item: any) => item !== props.currentGroupName,
              ),
              IAMPolicies: selectedUser[0].IAMPolicies || [],
            });
          }
        }
      }
      if (addedUsers.length) {
        for (const user of addedUsers) {
          const selectedUser = usersNotAWS.value.filter(i => i.Name === user);
          if (selectedUser.length) {
            await AdminModule.updateUser({
              Name: user,
              type: selectedUser[0].Type,
              IAMGroups: [...selectedUser[0].IAMGroups, props.currentGroupName],
              IAMPolicies: selectedUser[0].IAMPolicies || [],
            });
          }
        }
      }
      fetching.value = false;

      if (chosenPolicie.value.length > 0) {
        const groups: string[] = [];
        chosenUsers.value?.forEach((item) => {
          if (Array.isArray(item.IAMGroups)) {
            groups.push(...item.IAMGroups);
          }
        });

        chosenPolicie.value.map((item) => {
          const payload = {
            Name: item.name,
            Type: item?.type,
            Document: item?.document,
            Associations: [...(item?.associations || []), ...groups?.map((item) => item + ':' + 'GroupAWS')],
          };

          AdminModule.createPolicy(payload);

        })

      }
      await AdminModule.getUserOfGroup(props.currentGroupName);

      emit('toggleForm', false);
    }
    return {
      handleSubmit,
      handleBodyClick,
      usersNotAWS,
      allPoliciesLGVZ,
      usersOfGroup,
      handleShowForm,
      usersOfGroupFetching,
      fetching,
      submitted,
      chosenUsers,
      users,
      chosenPolicie
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
  min-height: 600px;
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
