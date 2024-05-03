<template>
  <div :class="$style['admin-container']">
    <div :class="$style['admin-header']">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="[
          $style['admin-header__item'],
          { [$style['admin-header__item--active']]: tab === currentTab },
        ]"
        type="button"
        @click="currentTab = tab"
      >
        {{ tab }}
      </button>
    </div>
    <div :class="$style['admin-form']"></div>
    <div :class="$style['body']">
      <UsersTable v-if="showUsersTable" />
      <GroupsTable v-if="showGroupsTable" />
      <PoliciesTable v-if="showPoliciesTable" />
      <PlatformTable v-if="showPlatformTable" />
    </div>
  </div>
</template>

<script lang="ts">
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.greenmist.css';

import { computed, ComputedRef, defineComponent, Ref, ref } from 'vue';

import GroupsTable from './groups/groups-table.vue';
import PlatformTable from './platform/platform-table.vue';
import PoliciesTable from './policies/policies-table.vue';
import UsersTable from './users/users-table.vue';

export enum AdminWindowTab {
  USERS = 'Users',
  GROUPS = 'Groups',
  POLICIES = 'Policies',
  PLATFORM = 'Platform',
}

export default defineComponent({
  name: 'AdminWindow',
  components: { UsersTable, GroupsTable, PoliciesTable, PlatformTable },
  setup() {
    const tabs: Ref<Array<AdminWindowTab>> = ref([
      AdminWindowTab.USERS,
      AdminWindowTab.GROUPS,
      AdminWindowTab.POLICIES,
      AdminWindowTab.PLATFORM,
    ]);

    const currentTab: Ref<AdminWindowTab> = ref(AdminWindowTab.USERS);

    const showUsersTable: ComputedRef<boolean> = computed(() => {
      return currentTab.value === AdminWindowTab.USERS;
    });

    const showGroupsTable: ComputedRef<boolean> = computed(() => {
      return currentTab.value === AdminWindowTab.GROUPS;
    });

    const showPoliciesTable: ComputedRef<boolean> = computed(() => {
      return currentTab.value === AdminWindowTab.POLICIES;
    });

    const showPlatformTable: ComputedRef<boolean> = computed(() => {
      return currentTab.value === AdminWindowTab.PLATFORM;
    });
    return {
      showPlatformTable,
      showPoliciesTable,
      showGroupsTable,
      showUsersTable,
      currentTab,
      tabs,
    };
  },
});
</script>

<style module lang="scss">
.container {
  width: 1179px;
  margin: 20px auto;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.admin-header {
  display: flex;
  padding-left: 18px;
  border-bottom: 1px solid rgba(174, 197, 223, 0.2);

  &__item {
    color: var(--grey-text-color);
    padding: 26px 25px 9px 25px;
    cursor: pointer;
    border-bottom: 3px solid transparent;

    &--active {
      color: var(--accent-color);
      border-bottom: 3px solid var(--accent-color);
    }
  }
}

.body {
  padding: 0 17px 19px 18px;
}

.admin-container {
  overflow-y: scroll;
  height: 100%;
}
</style>
