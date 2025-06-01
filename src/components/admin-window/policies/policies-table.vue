<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <div class="main-container">
    <div class="add-policy">
      <DxButton class="btn-add-policy" text="Add Logverz Policy" @click="showModal" />
    </div>
    <template v-if="showPolicyForm && currentPolicyType !== 'PolicyLGVZ'">
      <PoliciesForm :current-policy-name="currentPolicyName" @toggleForm="handleToggleForm" />
    </template>
    <template v-else-if="(showPolicyForm && currentPolicyType === 'PolicyLGVZ') || isModalVisible">
      <AddPolicy @closeModal="closeModal" :updatePolicy="updatePolicy" />
    </template>
    <div v-if="isLoading" class="loader-container">
      <Loader accent :size="50" />
    </div>
    <div v-if="isSuccess" class="table-wrapper">
      <template v-if="items.length > 0" class="table">
        <DxDataGrid id="gridContainer3" :show-borders="true" :data-source="items" :show-column-lines="true"
          :show-row-lines="true" :allow-column-reordering="true" :column-auto-width="true"
          @editing-start="handleStartEdit($event)">
          <DxHeaderFilter :visible="true" />
          <DxEditing :allow-updating="allowEditing" mode="form" />
          <DxFilterRow :visible="true" />
          <DxColumn data-field="Picture" caption=" " :width="50" cell-template="grid-cell-template" />
          <DxColumn data-field="Name" :width="400" />
          <DxColumn data-field="Type" caption="Policy Type" />

          <DxMasterDetail :enabled="true" template="masterDetailedUsers" />
          <template #masterDetailedUsers="{ data: employee }">
            <MasterDetailedPolicy :data="employee" :users-of-policies="usersOfPolicies" />
          </template>
          <template #grid-cell-template="{ data }">
            <div>
              <img :src="data.value" alt="server-photo" class="server-photo">
            </div>

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
import { DxButton } from 'devextreme-vue';

import MasterDetailedPolicy from '~/components/admin-window/policies/master-detailed-policy.vue';
import PoliciesForm from '~/components/admin-window/policies/policiesForm.vue';
import Loader from '~/components/shared/loader.vue';
import { AdminModule } from '~/store/modules/admin';
import { AsyncStatus } from '~/types';
import { policiesResponse } from '~/types/models/admin-window-types';
import AddPolicy from './add-policy.vue';

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
    DxHeaderFilter,
    AddPolicy,
    DxButton
  },
  setup() {
    const showPolicyForm: Ref<boolean> = ref(false);
    const currentPolicyName: Ref<string> = ref('');
    const currentPolicyType: Ref<string> = ref('');
    const updatePolicy: Ref<Record<string, any>> = ref({});

    const isModalVisible = ref(false);

    const showModal = () => {
      isModalVisible.value = true;
    };
    // Close modal
    const closeModal = () => {
      isModalVisible.value = false;
      showPolicyForm.value = false;
    };

    onMounted(async () => {
      await AdminModule.getPolicies();
    });
    const items: ComputedRef<policiesResponse[]> = computed(() => {
      return AdminModule.policies?.map((item: policiesResponse) => {
        return {
          ...item,
          Picture: item.Type === 'PolicyAWS' ? require('~/assets/images/aws.png') : require('~/assets/images/appIcon.png'),
        };
      }) || [];
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

    function handleStartEdit(e: { cancel: boolean; data: { Name: string, Type: string } }): void {
      console.log(e.data);

      currentPolicyName.value = e.data.Name;
      currentPolicyType.value = e.data.Type;
      showPolicyForm.value = true;
      e.cancel = true;
    }
    function allowEditing(e):boolean {
      updatePolicy.value = e.row?.data;
      return true;
      
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
      currentPolicyType,
      showModal,
      closeModal,
      isModalVisible,
      allowEditing,
      updatePolicy
    };
  },
});
</script>

<style scoped lang="scss">
.main-container {
  position: relative;
}

.server-photo {
  height: 30px;
  width: 30px;
}

.add-policy {
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 20px;

  .btn-add-policy {
    background-color: var(--accent-color);
    color: #fff;
    width: 158px;
    height: 45px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 500;
  }

  .btn-add-policy {
    background-color: var(--accent-color);
    color: #fff;
    width: 10%;
    height: 45px;
    min-width: 147px;
    margin-left: 13px;
    font-weight: 500;
    font-size: 14px;

    &:hover {
      background-color: var(--accent-color);
      color: #fff;
    }
  }

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
