<template>
  <div>
    <template v-if="usersGroupsFetching">
      <Loader accent />
    </template>
    <template v-else>
      <h1>Members</h1>
      <DxDataGrid
        :show-borders="true"
        :data-source="userOfGroup[data.data.Name]"
        :show-column-lines="true"
        :show-row-lines="true"
        :allow-column-reordering="true"
        :column-auto-width="true"
      >
        <DxColumn data-field="Name" />
        <DxColumn data-field="Type" />
        <DxColumn data-field="IAMPolicies" />
      </DxDataGrid>
    </template>

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
            <div v-if="k !== ''" :class="$style['container']">
              <span :class="$style['container__key']">{{ i }}: </span>
              <span :class="$style['container__value']">{{ k }}</span>
            </div>
          </template>
        </div>
      </div>
      <div v-if="Array.isArray(data.data[item])" :key="item + Math.random() * 10000">
        <div :class="$style['container']">
          <span :class="$style['container__key']">{{ item }}: </span>
          <span
            v-for="(arrItem, index) in data.data[item]"
            :key="arrItem + Math.random() * 10000"
            :class="$style['container__value']"
            >{{ arrItem }}{{ data.data[item].length - 1 !== index ? ',' : '' }}</span
          >
        </div>
      </div>
      <div v-if="data.data[item] === 'null'" :key="item + Math.random() * 10000">
        <div :class="$style['container']">
          <span :class="$style['container__key']">{{ item }}: </span>
          <span :class="$style['container__value']">{{ data.data[item] }}</span>
        </div>
      </div>
    </template> -->

    <template v-if="data.data.Policies">
      <h1 :class="$style['container__margin-8px']">Policies</h1>

      <template v-for="(value, index) in data.data.Policies">
        <div v-if="Object.keys(value).length" :key="index">
          <p>{{ index }}</p>
          <json-viewer-custom
            :value="parseGroupPolicy(JSON.parse(value[0]))"
            copyable
            boxed
            sort
            :title="'PolicyName: ' + JSON.parse(value[0]).PolicyName"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, PropType } from 'vue';
import { DxColumn, DxDataGrid } from 'devextreme-vue/data-grid';

import Loader from '~/components/shared/loader.vue';
import { AdminModule } from '~/store/modules/admin';
import { groupResponse, IPoliciesGroup } from '~/types/models/admin-window-types';
import { parseGroupPolicy as parseGroupPolicyFn } from '~/utils/parseGroup';

// @Component({

// })
export default defineComponent({
  // @Prop({ required: false, type: Object }) readonly data!: { data: groupResponse };
  // @Prop({ required: false }) readonly userOfGroup!: any;
  name: 'MasterDetailedGroups',
  components: { Loader, DxColumn, DxDataGrid },
  props: {
    data: {
      type: Object as PropType<{ data: groupResponse }>,
      required: true,
    },
    userOfGroup: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    onMounted(async () => {
      await AdminModule.getUserOfGroup(props.data.data.Name);
    });

    const usersGroupsFetching: ComputedRef<boolean> = computed(() => {
      return AdminModule.usersGroupsFetching[props.data.data.Name];
    });

    function parseGroupPolicy(data: IPoliciesGroup) {
      return parseGroupPolicyFn(data);
    }
    return {
      usersGroupsFetching,
      parseGroupPolicy,
    };
  },
});
</script>

<style module lang="scss">
@import '../styles';

.container {
  margin: 15px 0;

  &__key {
    font-size: 14px;
    color: var(--accent-color);
  }

  &__value {
    font-size: 13px;
    color: #000000;
  }

  &__margin-8px {
    margin-top: 8px;
  }
}
</style>
