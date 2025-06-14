<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <div class="main-container">
    <template v-if="showPolicyForm">
      <RolesForm :current-policy-name="currentPolicyName" @toggleForm="handleToggleForm" />
    </template>
    <div v-if="isLoading" class="loader-container">
      <Loader accent :size="50" />
    </div>
    <div v-if="isSuccess" class="table-wrapper">
      <template v-if="items.length > 0" class="table">
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
            <MasterDetailedRole :data="employee" />
          </template>
        </DxDataGrid>
      </template>
      <div v-else class="not-found-message">Items not found</div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  DxColumn,
  DxDataGrid,
  DxEditing,
  DxFilterRow,
  DxHeaderFilter,
  DxMasterDetail,
} from 'devextreme-vue/data-grid';
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref } from 'vue';

import Loader from '~/components/shared/loader.vue';
import { AdminModule } from '~/store/modules/admin';
import { AsyncStatus } from '~/types';
import { policiesResponse, rolesResponse } from '~/types/models/admin-window-types';
import MasterDetailedRole from './master-detailed-role.vue';
import RolesForm from './rolesForm.vue';

export default defineComponent({
  name: 'RolesTable',
  components: {
    MasterDetailedRole,
    RolesForm,
    Loader,
    DxColumn,
    DxDataGrid,
    DxFilterRow,
    DxMasterDetail,
    DxEditing,
    DxHeaderFilter,
  },
  setup() {
    const showPolicyForm: Ref<boolean> = ref(false);
    const currentPolicyName: Ref<string> = ref('');
    onMounted(async () => {
      await AdminModule.getRoles();
    });
    const items: ComputedRef<rolesResponse[]> = computed(() => {
      return AdminModule.roles;
    });
    const isLoading: ComputedRef<boolean> = computed(() => {
      return AdminModule.rolesStatus === AsyncStatus.LOADING;
    });
    const usersOfPolicies: ComputedRef<any> = computed(() => {
      return AdminModule.usersOfPolicies;
    });
    const isSuccess: ComputedRef<boolean> = computed(() => {
      return AdminModule.rolesStatus === AsyncStatus.SUCCESS;
    });

    function handleStartEdit(e: { cancel: boolean; data: { Name: string } }): void {
      currentPolicyName.value = e.data.Name;
      showPolicyForm.value = true;
      e.cancel = true;
    }

    function handleToggleForm(value: boolean): void {
      showPolicyForm.value = value;
    }
    return {
      handleToggleForm,
      handleStartEdit,
      isSuccess,
      usersOfPolicies,
      isLoading,
      items,
      currentPolicyName,
      showPolicyForm,
    };
  },
});
</script>

<style scoped lang="scss">
.main-container {
  position: relative;
}
</style>

<style>
#gridContainer3 {
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
