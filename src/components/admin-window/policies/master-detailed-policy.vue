<template>
  <div>
    <template v-if="usersPoliciesFetching">
      <Loader accent />
    </template>
    <!-- <template v-else>
      <DxDataGrid
        :show-borders="true"
        :data-source="usersOfPolicies[data?.data.Name]"
        :show-column-lines="true"
        :show-row-lines="true"
        :allow-column-reordering="true"
        :column-auto-width="true"
      >
        <DxHeaderFilter :visible="true" />
        <DxColumn data-field="Name" />
        <DxColumn data-field="Type" />
        <DxColumn data-field="Arn" />
      </DxDataGrid>
    </template> -->

    <!-- <template v-for="item in Object.keys(data.data)">
      <div
        v-if="typeof data.data[item] === 'object' && !Array.isArray(data.data[item])"
        :key="item + Math.random() * 10000"
      >
        <div v-for="(k, i) in data.data[item]" :key="i + Math.random() * 10000">
          <template v-if="typeof k === 'object'">
            <ParseObject :obj="k" :label="i" />
          </template>
          <template v-else>
            <div v-if="k !== ''" class="container">
              <span class="container__key">{{ i }}: </span>
              <div class="container__value">{{ k }}</div>
            </div>
          </template>
        </div>
      </div>
      <div v-if="Array.isArray(data.data[item])" :key="item + Math.random() * 10000">
        <div class="container">
          <span class="container__key">{{ item }}: </span>
          <div
            v-for="(arrItem, index) in data.data[item]"
            :key="arrItem + Math.random() * 10000"
            class="container__value"
          >
            {{ arrItem }}{{ data.data[item].length - 1 !== index ? ',' : '' }}
          </div>
        </div>
      </div>
      <div v-if="data.data[item] === 'null'" :key="item + Math.random() * 10000">
        <div class="container">
          <span class="container__key">{{ item }}: </span>
          <div class="container__value">{{ data.data[item] }}</div>
        </div>
      </div>
    </template> -->

    <!-- <info-msg-span title="VersionId" :value="data?.data.LatestVersion.VersionId" />
    <info-msg-span title="IsDefaultVersion" :value="data?.data.LatestVersion.IsDefaultVersion?.toString()" />
    <info-msg-span title="CreateDate" :value="data?.data.LatestVersion.IsDefaultVersion?.toString()" /> -->
    <info-msg-span title="VersionId" :value="data?.data.LatestVersion.VersionId" />
    <info-msg-span
      title="IsDefaultVersion"
      :value="data?.data.LatestVersion.IsDefaultVersion?.toString()"
    />
    <info-msg-span
      title="CreateDate"
      :value="data?.data.LatestVersion.IsDefaultVersion?.toString()"
    />
    <json-viewer-custom
      :value="parseGroupPolicy(data?.data)"
      copyable
      boxed
      sort
      title="Document:"
    />

</div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted } from 'vue';
import { DxColumn, DxDataGrid, DxHeaderFilter } from 'devextreme-vue/data-grid';

import Loader from '~/components/shared/loader.vue';
import { AdminModule } from '~/store/modules/admin';
import JsonViewerCustom from '~/components/shared/json-viewer.vue';

export default defineComponent({
  name: 'MasterDetailedPolicy',
  components: { Loader, DxColumn, DxDataGrid, DxHeaderFilter, JsonViewerCustom },

  // @Prop({ required: false, type: Object }) readonly data!: Record<string, any>;
  // @Prop({ required: false }) readonly usersOfPolicies!: any;
  props: {
    data: {
      type: Object,
      required: false,
    },
    // usersOfPolicies: {
    //   type: Array,
    //   required: true,
    // },
  },
  setup(props) {
    console.log('parseGroupPolicy', props.data);

    onMounted(async () => {
      AdminModule.getUserOfPolicy(props.data?.data.Name);
    });

    const usersPoliciesFetching: ComputedRef<any> = computed(() => {
      return AdminModule.usersPoliciesFetching[props.data?.data.Name];
    });

    function parseGroupPolicy(data: any): unknown {
      console.log('parseGroupPolicy', data);
      
      return { Associations: data.Associations, LatestVersion: {  Document: JSON.parse(data.LatestVersion?.Document?.replaceAll('"', '').replaceAll("'", '"')) } };
    }
    return {
      parseGroupPolicy,
      usersPoliciesFetching,
    };
  },
});
</script>

<style scoped lang="scss">
.container {
  margin: 15px 0;

  &__key {
    font-size: 14px;
    color: var(--accent-color);
  }

  &__value {
    font-size: 13px;
    color: #000000;
    display: block;
    word-wrap: break-word;
    width: 100%;
    white-space: normal;
  }
}
</style>
