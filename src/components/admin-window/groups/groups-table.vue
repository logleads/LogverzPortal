<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <div :class="$style['main-container']">
    <template v-if="showForm">
      <GroupsForm :current-group-name="currentGroupName" @toggleForm="handleToggle" />
    </template>
    <div v-if="isLoading" :class="$style['loader-container']">
      <Loader accent :size="50" />
    </div>
    <div v-if="isSuccess" :class="$style['table-wrapper']">
      <template v-if="items.length > 0" :class="$style['table']">
        <DxDataGrid
          id="gridContainer3"
          :show-borders="true"
          :data-source="items"
          :show-column-lines="true"
          :show-row-lines="true"
          :allow-column-reordering="true"
          :column-auto-width="true"
          @editing-start="handleStartEdit($event)"
        >
          <DxHeaderFilter :visible="true" />
          <DxEditing :allow-updating="true" mode="form" />
          <DxFilterRow :visible="true" />
          <DxColumn data-field="Name" />

          <DxMasterDetail :enabled="true" template="masterDetailedUsers" />
          <template #masterDetailedUsers="{ data: employee }">
            <MasterDetailedGroups :data="employee" :user-of-group="userOfGroup" />
          </template>
        </DxDataGrid>
      </template>
      <div v-else :class="$style['not-found-message']">Items not found</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref } from 'vue';
import {
  DxColumn,
  DxDataGrid,
  DxEditing,
  DxFilterRow,
  DxHeaderFilter,
  DxMasterDetail,
} from 'devextreme-vue/data-grid';

import GroupsForm from '~/components/admin-window/groups/groupsForm.vue';
import MasterDetailedGroups from '~/components/admin-window/groups/master-detailed-groups.vue';
import Loader from '~/components/shared/loader.vue';
import { AdminModule } from '~/store/modules/admin';
import { AsyncStatus } from '~/types';
import { groupResponse } from '~/types/models/admin-window-types';

export default defineComponent({
  name: 'GroupsTable',
  components: {
    GroupsForm,
    Loader,
    DxColumn,
    DxDataGrid,
    DxFilterRow,
    DxMasterDetail,
    DxEditing,
    MasterDetailedGroups,
    DxHeaderFilter,
  },
  setup() {
    const showForm: Ref<boolean> = ref(false);
    const currentGroupName: Ref<string> = ref('');
    onMounted(async () => {
      await AdminModule.getGroups();
      await AdminModule.getUsers();
    });
    const items: ComputedRef<groupResponse[]> = computed(() => {
      return AdminModule.groups;
    });
    const isLoading: ComputedRef<boolean> = computed(() => {
      return AdminModule.groupsStatus === AsyncStatus.LOADING;
    });
    const userOfGroup: ComputedRef<any> = computed(() => {
      return AdminModule.usersOfGroups;
    });
    const isSuccess: ComputedRef<any> = computed(() => {
      return AdminModule.groupsStatus === AsyncStatus.SUCCESS;
    });

    function handleToggle(value: boolean): void {
      showForm.value = value;
    }

    function handleStartEdit(e: { cancel: boolean; data: { Name: string } }): void {
      currentGroupName.value = e.data.Name;
      showForm.value = true;
      e.cancel = true;
    }
    return {
      handleStartEdit,
      handleToggle,
      isSuccess,
      isLoading,
      userOfGroup,
      items,
      currentGroupName,
      showForm,
    };
  },
});
</script>

<style module lang="scss">
.main-container {
  position: relative;
}
</style>

<style scoped>
#gridContainer3{
  font-family: 'Roboto', sans-serif;

}
#gridContainer3 .dx-command-edit a {
  color: white;
  text-decoration: none;
  background-color: var(--accent-color);
  border-radius: 5px;
  padding: 5px 10px;
  font-weight: 500;
  font-size: 14px;
}
</style>
