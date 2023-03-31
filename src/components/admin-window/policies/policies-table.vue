<template>
  <div :class="$style['main-container']">
    <template v-if="showPolicyForm">
      <PoliciesForm :current-policy-name="currentPolicyName" @toggleForm="handleToggleForm" />
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
          <DxEditing :allow-updating="true" mode="form" />
          <DxFilterRow :visible="true" />
          <DxColumn data-field="Name" />

          <DxMasterDetail :enabled="true" template="masterDetailedUsers" />
          <template #masterDetailedUsers="{ data: employee }">
            <MasterDetailedPolicy :data="employee" :users-of-policies="usersOfPolicies" />
          </template>
        </DxDataGrid>
      </template>
      <div v-else :class="$style['not-found-message']">Items not found</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref } from '@vue/composition-api';
import {
  DxColumn,
  DxDataGrid,
  DxEditing,
  DxFilterRow,
  DxMasterDetail,
} from 'devextreme-vue/data-grid';

import MasterDetailedPolicy from '~/components/admin-window/policies/master-detailed-policy.vue';
import PoliciesForm from '~/components/admin-window/policies/policiesForm.vue';
import Loader from '~/components/shared/loader.vue';
import { AdminModule } from '~/store/modules/admin';
import { AsyncStatus } from '~/types';
import { policiesResponse } from '~/types/models/admin-window-types';

export default defineComponent({
  name: 'PoliciesTable',
  components: {
    MasterDetailedPolicy,
    PoliciesForm,
    Loader,
    DxColumn,
    DxDataGrid,
    DxFilterRow,
    DxMasterDetail,
    DxEditing,
  },
  setup() {
    const showPolicyForm: Ref<boolean> = ref(false);
    const currentPolicyName: Ref<string> = ref('');
    onMounted(async () => {
      await AdminModule.getPolicies();
    });
    const items: ComputedRef<policiesResponse[]> = computed(() => {
      return AdminModule.policies;
    });
    const isLoading: ComputedRef<boolean> = computed(() => {
      return AdminModule.policiesStatus === AsyncStatus.LOADING;
    });
    const usersOfPolicies: ComputedRef<any> = computed(() => {
      return AdminModule.usersOfPolicies;
    });
    const isSuccess: ComputedRef<boolean> = computed(() => {
      return AdminModule.policiesStatus === AsyncStatus.SUCCESS;
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

<style module lang="scss">
.main-container {
  position: relative;
}
</style>

<style>
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
