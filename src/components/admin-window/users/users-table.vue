<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <div :class="$style['main-container']">
    <template v-if="showUpdateForm">
      <UpdateUserForm
        :name="prevName"
        :type="prevType"
        :prev-groups="prevChosenGroup"
        :prev-policies="prevChosenPolicies"
        @toggleForm="toggleUpdateForm"
      />
    </template>
    <div v-if="showForm" :class="$style['form']" @click="handleShowForm($event, false)">
      <div :class="$style['form__body']" @click="handleBodyClick($event)">
        <div :class="$style['input-wrapper']">
          <div :class="$style['flex']">
            <span :class="$style['lb']">Name</span>
            <ToolTip :tip="AW_NAME_LOCAL" />
          </div>
          <Input
            slot="input"
            v-model="Name1"
            name="name"
            :placeholder="'Specify username'"
            :error="submitted && !v$.Name1.$invalid && v$.Name1.$dirty"
          />
          <div
            v-if="submitted && !v$.Name1.$invalid && v$.Name1.$dirty"
            :class="$style['validation-text']"
          >
            Name is required
          </div>
        </div>
        <div :class="$style['input-wrapper']">
          <div :class="$style['flex']">
            <span :class="$style['lb']">Type</span>
            <ToolTip :tip="AW_TYPE_LOCAL" />
          </div>
          <DropDownSimple
            slot="input"
            :content="Type"
            :items="availableTypes"
            placeholder="Select usertype"
            name="Type"
            @select-value="handleTypeSelect"
          />
          <div
            v-if="submitted && !v$.Type.$invalid && v$.Type.$dirty"
            :class="$style['validation-text']"
          >
            Type is required
          </div>
        </div>
        <div :class="$style['input-wrapper__multi']">
          <div :class="$style['flex']">
            <span :class="$style['lb']">Groups</span>
            <ToolTip :tip="AW_GROUPS_LOCAL" />
          </div>
          <multiselect
            v-model="chosenGroup"
            name="chosenGroup"
            :options="groups"
            :multiple="true"
            :close-on-select="true"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="Select Group(s)"
            label="name"
            track-by="name"
            :class="{
              invalid: submitted && !v$.chosenGroup.$invalid && v$.chosenPolicies.$dirty,
            }"
          />
        </div>
        <div
          v-if="submitted && !v$.chosenGroup.$invalid && v$.chosenPolicies.$dirty"
          :class="$style['validation-text']"
        >
          Policies and Groups are required
        </div>
        <div :class="$style['input-wrapper__multi']">
          <div :class="$style['flex']">
            <span :class="$style['lb']">Policies</span>
            <ToolTip :tip="AW_POLICIES_LOCAL" />
          </div>
          <multiselect
            v-model="chosenPolicies"
            name="chosenPolicies"
            :options="policies"
            :multiple="true"
            :close-on-select="true"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="Select option"
            label="name"
            track-by="name"
            :class="{
              invalid: submitted && !v$.chosenGroup.$invalid && v$.chosenPolicies.$dirty,
            }"
          />
          <div
            v-if="submitted && !v$.chosenGroup.$invalid && v$.chosenPolicies.$dirty"
            :class="$style['validation-text']"
          >
            Policies and Groups are required
          </div>
        </div>
        <div :class="$style['button-container']">
          <Button
            text="Save"
            :disabled="
              submitted ||
              (v$.chosenGroup.$invalid && v$.chosenPolicies.$invalid) ||
              v$.Type.$invalid ||
              v$.Name1.$invalid
            "
            no-load
            @click="handleSubmit"
          />
        </div>
      </div>
    </div>
    <div v-if="isLoading" :class="$style['loader-container']">
      <Loader accent :size="50" />
    </div>
    <div v-if="isSuccess" :class="$style['table-wrapper']">
      <template v-if="items.length > 0" :class="$style['table']">
        <div :class="$style['search']">
          <template v-if="availableTypes.length">
            <Button
              :class="$style['search__button']"
              text="Add external users"
              @click="handleShowForm($event, true)"
            />
          </template>
          <template v-else>
            <h1 :class="$style['info']">
              Please manage AWS IAM users on AWS console, once finished start identity sync and wait
              half a minute
            </h1>
          </template>
        </div>
        <DxDataGrid
          id="gridContainer3"
          :show-borders="true"
          :data-source="items"
          :show-column-lines="true"
          :show-row-lines="true"
          :allow-column-reordering="true"
          :column-auto-width="true"
          @row-removing="handleRemove($event)"
          @editing-start="handleStartEdit($event)"
        >
          <DxHeaderFilter :visible="true" />
          <DxEditing :allow-updating="allowEditing" :allow-deleting="allowEditing" mode="form" />
          <DxFilterRow :visible="true" />
          <DxColumn data-field="Name" />
          <DxColumn data-field="Type" />
          <DxColumn data-field="IAMGroups" cell-template="IAMGroups" />
          <template #IAMGroups="{ data }">
            <div>
              <p v-for="(item, index) in data.data.IAMGroups.split(',')" :key="index">{{ item }}</p>
            </div>
          </template>
          <DxColumn data-field="IAMPolicies" />

          <DxMasterDetail :enabled="true" template="masterDetailedUsers" />
          <template #masterDetailedUsers="{ data }">
            <MasterDetailedUsers :data="data" :plain-items="plainItems" />
          </template>
        </DxDataGrid>
      </template>
      <div v-else :class="$style['not-found-message']">Items not found</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref } from '@vue/composition-api';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
// import { required } from '@vuelidate/validators';
import {
  DxColumn,
  DxDataGrid,
  DxEditing,
  DxFilterRow,
  DxHeaderFilter,
  DxMasterDetail,
} from 'devextreme-vue/data-grid';
import Multiselect from 'vue-multiselect';

import MasterDetailedUsers from '~/components/admin-window/users/master-detailed-users.vue';
import UpdateUserForm from '~/components/admin-window/users/update-user-form.vue';
import Button from '~/components/shared/button.vue';
import DropDownSimple from '~/components/shared/drop-down-simple.vue';
import Input from '~/components/shared/input.vue';
import Loader from '~/components/shared/loader.vue';
import ToolTip from '~/components/shared/tool-tip.vue';
import { AW_GROUPS, AW_NAME, AW_POLICIES, AW_TYPE } from '~/constants';
import { AdminModule } from '~/store/modules/admin';
import { AsyncStatus } from '~/types';
import {
  userResponse,
  userResponseModified,
  userResponseModifiedForUpdate,
} from '~/types/models/admin-window-types';

export default defineComponent({
  name: 'UsersTable',
  components: {
    DropDownSimple,
    UpdateUserForm,
    MasterDetailedUsers,
    Loader,
    DxDataGrid,
    DxFilterRow,
    DxMasterDetail,
    DxColumn,
    DxEditing,
    // eslint-disable-next-line vue/no-reserved-component-names
    Button,
    // eslint-disable-next-line vue/no-reserved-component-names
    Input,
    Multiselect,
    ToolTip,
    DxHeaderFilter,
  },
  setup() {
    const Name1: Ref<string> = ref('');
    const prevName: Ref<string> = ref('');
    const prevType: Ref<string> = ref('');
    const prevChosenGroup: Ref<Array<{ name: string }>> = ref([]);
    const prevChosenPolicies: Ref<Array<{ name: string }>> = ref([]);
    const showForm: Ref<boolean> = ref(false);
    const showUpdateForm: Ref<boolean> = ref(false);
    const submitted: Ref<boolean> = ref(false);
    const chosenGroup: Ref<Array<{ name: string }>> = ref([]);
    const chosenPolicies: Ref<Array<{ name: string }>> = ref([]);
    const AW_NAME_LOCAL = ref(AW_NAME);
    const AW_TYPE_LOCAL = ref(AW_TYPE);
    const AW_GROUPS_LOCAL = ref(AW_GROUPS);
    const AW_POLICIES_LOCAL = ref(AW_POLICIES);
    const rules = {
      Name1: { required },
      Type: { required },
      chosenGroup: { required },
      chosenPolicies: { required },
    };
    const Type: ComputedRef<string> = computed(() => {
      return AdminModule.currentType;
    });

    const v$ = useVuelidate(rules, { Name1, Type, chosenGroup, chosenPolicies });
    onMounted(async () => {
      await AdminModule.getUsers();
      await AdminModule.getGroups();
      await AdminModule.getPolicies();
    });
    // async mounted(): Promise<void> {
    //   AdminModule.getUsers();
    //   AdminModule.getGroups();
    //   AdminModule.getPolicies();
    // }
    const groups: ComputedRef<Array<{ name: string }>> = computed(() => {
      return AdminModule.groups.map(i => ({ name: i.Name }));
    });

    const availableTypes: ComputedRef<string[]> = computed(() => {
      return AdminModule.availableTypes;
    });

    const policies: ComputedRef<Array<{ name: string }>> = computed(() => {
      return AdminModule.policies.map(i => ({ name: i.Name }));
    });

    const items: ComputedRef<userResponseModified[]> = computed(() => {
      return modifyDataForTable(AdminModule.users);
    });

    const plainItems: ComputedRef<userResponse[]> = computed(() => {
      return AdminModule.users;
    });

    function handleTypeSelect(payload: { item: string; content: string }): void {
      AdminModule.setCurrentType(payload.item);
    }

    function modifyDataForTable(data: userResponse[]): userResponseModified[] {
      const extractPolicy = (value: string): string => {
        const extractName = 'PolicyName';
        if (value.includes(extractName)) {
          const inx = value.indexOf(extractName);
          const str = value.slice(inx + extractName.length + 3, value.length);
          return str.slice(0, str.indexOf('"'));
        } else {
          return '';
        }
      };

      const reducer = (accumulator: string, currentValue: string): string => {
        return extractPolicy(accumulator) + ', ' + extractPolicy(currentValue);
      };

      return data.map(i => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let addedProperty: any = {};
        if (i['IAMPolicies']?.length) {
          addedProperty['IAMPolicies'] = i['IAMPolicies'].reduce(
            (accumulator, currentValue) => accumulator + ', ' + currentValue,
          );
        }

        return {
          ...i,
          IAMGroups: i.IAMGroups.length
            ? i.IAMGroups?.reduce((accumulator, currentValue) => accumulator + ', ' + currentValue)
            : '',
          ...addedProperty,
          Policies: {
            GroupAttached:
              i.Policies.GroupAttached &&
              i.Policies.GroupAttached.length &&
              i.Policies.GroupAttached.length !== 1
                ? i.Policies.GroupAttached.reduce(reducer)
                : i.Policies.GroupAttached.length === 1
                  ? extractPolicy(i.Policies.GroupAttached[0])
                  : '',
            GroupInline:
              i.Policies.GroupInline &&
              i.Policies.GroupInline.length &&
              i.Policies.GroupInline.length !== 1
                ? i.Policies.GroupInline.reduce(reducer)
                : i.Policies.GroupInline.length === 1
                  ? extractPolicy(i.Policies.GroupInline[0])
                  : '',
            UserAttached:
              i.Policies.UserAttached &&
              i.Policies.UserAttached.length &&
              i.Policies.UserAttached.length !== 1
                ? i.Policies.UserAttached.reduce(reducer)
                : i.Policies.UserAttached.length === 1
                  ? extractPolicy(i.Policies.UserAttached[0])
                  : '',
            UserInline:
              i.Policies.UserInline &&
              i.Policies.UserInline.length &&
              i.Policies.UserInline.length !== 1
                ? i.Policies.UserInline.reduce(reducer)
                : i.Policies.UserInline?.length === 1
                  ? extractPolicy(i.Policies.UserInline[0])
                  : '',
          },
        };
      });
    }
    const isLoading: ComputedRef<boolean> = computed(() => {
      return AdminModule.usersStatus === AsyncStatus.LOADING;
    });

    const isSuccess: ComputedRef<boolean> = computed(() => {
      return AdminModule.usersStatus === AsyncStatus.SUCCESS;
    });

    function handleSubmit(): void {
      submitted.value = true;
      if (
        submitted.value ||
        (!v$.value.chosenGroup.$invalid && !v$.value.chosenPolicies.$invalid) ||
        !v$.value.Type.$invalid ||
        !v$.value.Name1.$invalid
      ) {
        const IAMGroups = chosenGroup.value.map(i => i.name);
        const IAMPolicies = chosenPolicies.value.map(i => i.name);
        AdminModule.createUser({ Name: Name1.value, Type: Type.value, IAMGroups, IAMPolicies });
        showForm.value = false;
        clearForm();
      }
    }
    function clearForm() {
      Name1.value = '';
      chosenPolicies.value = [];
      chosenGroup.value = [];
    }
    function handleStartEdit(e: { data: userResponseModified; cancel: boolean }): void {
      const d = prepareData(e.data);
      prevChosenGroup.value = d.IAMGroups.map(i => ({ name: i }));
      prevChosenPolicies.value = d.IAMPolicies?.map(i => ({ name: i })) || [];

      prevName.value = e.data.Name;
      prevType.value = e.data.Type;
      showUpdateForm.value = true;
      e.cancel = true;
    }

    function toggleUpdateForm(value: boolean): void {
      console.log('RECEIVED THE EMIT');
      showUpdateForm.value = value;
    }

    function allowEditing(e: { row: { key: { Type: string } } }): boolean {
      return e.row.key.Type !== 'UserAWS';
    }

    function handleShowForm(e: Event, value: boolean): void {
      e.stopPropagation();
      showForm.value = value;
    }

    function handleBodyClick(e: Event): void {
      e.stopPropagation();
    }

    function handleRemove(e: any): void {
      AdminModule.deleteUser({ Name: e.data.Name, Type: e.data.Type });
    }

    function prepareData(data: userResponseModified): userResponseModifiedForUpdate {
      if (data.IAMPolicies && data.IAMPolicies.length && data.IAMGroups.length) {
        return {
          ...data,
          IAMGroups: data.IAMGroups.split(',').map(i => i.trim()),
          IAMPolicies: data.IAMPolicies.split(',').map(i => i.trim()),
        };
      } else {
        return {
          ...data,
          IAMGroups: data.IAMGroups.split(',').map(i => i.trim()),
          IAMPolicies: [],
        };
      }
    }
    return {
      prepareData,
      handleRemove,
      handleBodyClick,
      handleShowForm,
      allowEditing,
      toggleUpdateForm,
      handleStartEdit,
      handleSubmit,
      isSuccess,
      isLoading,
      modifyDataForTable,
      handleTypeSelect,
      plainItems,
      items,
      policies,
      availableTypes,
      groups,
      Type,
      v$,
      AW_GROUPS_LOCAL,
      AW_NAME_LOCAL,
      AW_POLICIES_LOCAL,
      AW_TYPE_LOCAL,
      chosenPolicies,
      chosenGroup,
      submitted,
      showUpdateForm,
      showForm,
      prevChosenPolicies,
      prevChosenGroup,
      prevType,
      prevName,
      Name1,
      rules,
    };
  },
});
</script>

<style module lang="scss">
@import '../styles';

.search {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-bottom: 10px;

  &__button {
    width: 10%;
    height: 45px;
    min-width: 147px;
    margin-left: 13px;
    font-weight: 500;
    font-size: 14px;
  }
}

.main-container {
  // position: relative;
}

.form {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: rgba(43, 42, 44, 0.4);
  // top: 0;
  // right: -20px;
  transform: translate(0, -9%);

  &__body {
    position: absolute;
    z-index: 4;
    top: 70%;
    right: 50%;
    transform: translate(64%, -74%);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    width: 55%;
    height: 100%;
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

.label-icon {
  color: var(--accent-color);
}

.button-container {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}

.validation-text {
  color: red;
  font-size: 12px;
  margin-top: 10px;
}

:global(.multiselect__tag) {
  background-color: var(--accent-color);
}

:global(.multiselect__option--highlight) {
  background: var(--accent-color);
}

:global(.invalid .multiselect__tags) {
  border-color: red;
}

:global(.multiselect__placeholder) {
  color: #adadad;
  display: inline-block;
  margin-bottom: 10px;
  padding-top: 5px;
  padding-left: 11px;
  font-weight: 500;
  font-size: 12px;
}

.info {
  color: var(--blue-text-color);
  font-weight: 500;
  font-size: 14px;
}

.lb {
  font-size: 12px;
  color: var(--secondary-text-color);
  margin-right: 10px;
}

.flex {
  display: flex;
  align-items: center;
  margin-bottom: 9px;
}
</style>

<style>
#gridContainer2 {
  height: 700px;
}

#gridContainer2 .dx-command-edit a {
  color: white;
  text-decoration: none;
  background-color: var(--accent-color);
  border-radius: 5px;
  padding: 5px 10px;
  font-weight: 500;
  font-size: 14px;
}
</style>
