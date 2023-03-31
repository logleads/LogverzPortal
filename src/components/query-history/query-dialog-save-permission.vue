<template>
  <div v-if="isOpenPermissionDialog" :class="[$style['container']]" @click.self="close">
    <div :class="[$style['container__window']]">
      <div :class="[$style['container__body']]">
        <h4>Change Permissions</h4>
        <br />
        <div>
          <label :class="$style['multiselect-label']">
            <span> {{ isAnalysis ? 'Analysis Owners' : 'Dataset Owners' }} </span>
            <ToolTip :tip="local_DCH_TABLE_OWNERS" />
          </label>
          <div>
            <multiselect
              v-model="Owners"
              name="DatasetOwners"
              :options="TableOptions"
              :multiple="true"
              :close-on-select="true"
              :clear-on-select="false"
              :preserve-search="true"
              placeholder="Select option"
              label="name"
              track-by="name"
              :preselect-first="true"
            />

            <!-- :class="{ invalid: submitted && !$v.DatasetOwners.required }" -->
          </div>

          <!-- <div v-if="submitted && !$v.DatasetOwners.required" :class="$style['validation-text']">
              DatasetOwners is required
            </div> -->
        </div>
        <div>
          <label :class="$style['multiselect-label']">
            <span> {{ isAnalysis ? 'Analysis Access' : 'Dataset Access' }} </span>
            <ToolTip :tip="local_DCH_TABLE_ACCESS" />
          </label>
          <div>
            <multiselect
              v-model="Access"
              name="DatasetAccess"
              :options="TableOptions"
              :multiple="true"
              :close-on-select="true"
              :clear-on-select="false"
              :preserve-search="true"
              placeholder="Select option"
              label="name"
              track-by="name"
              :preselect-first="true"
            />
          </div>

          <!-- <div v-if="submitted && !$v.DatasetAccess.required" :class="$style['validation-text']">
              DatasetAccess is required
            </div> -->
        </div>
      </div>
      <div :class="[$style['container__footer']]">
        <Button text="Cancel" @click="close" />
        <Button text="Save" @click="save" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import { maxLength, required } from 'vuelidate/lib/validators';
import { computed, ComputedRef, defineComponent, Ref, ref, watch } from '@vue/composition-api';
import Multiselect from 'vue-multiselect';

import Button from '~/components/shared/button.vue';
import ToolTip from '~/components/shared/tool-tip.vue';
import { DCH_TABLE_ACCESS, DCH_TABLE_OWNERS } from '~/constants';
import { DataCollectionModule } from '~/store/modules/data-collection';
import { SaveSettingModule } from '~/store/modules/save-setting';

export default defineComponent({
  name: 'QueryHistoryPermission',
  components: {
    Button,
    Multiselect,
    ToolTip,
  },
  props: {
    isAnalysis: {
      type: Boolean,
      required: true,
    },
  },
  // @Prop({ required: false, type: Boolean }) readonly isAnalysis!: boolean;
  setup(props, { emit }) {
    const local_DCH_TABLE_ACCESS = ref(DCH_TABLE_ACCESS);
    const local_DCH_TABLE_OWNERS = ref(DCH_TABLE_OWNERS);
    const Name: Ref<string> = ref('');
    const unixTime: Ref<number> = ref(0);
    const UsersQuery: Ref<string> = ref('');

    const submitted: Ref<boolean> = ref(false);
    const queryData = ref([]);
    // public Owners:Array<{ name: string }> = [];
    // public Access:Array<{ name: string }> = [];

    const validOwner: Ref<{ $invalid: boolean } | null> = ref(null);

    const SavedQuery: ComputedRef = computed(() => {
      let data = SaveSettingModule.savedData;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      unixTime.value = data.UnixTime;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      UsersQuery.value = data.UsersQuery;
      return data;
    });
    watch(SavedQuery, (value: any) => {
      unixTime.value = value.UnixTime;
      UsersQuery.value = value.UsersQuery;
    });

    function reArrangetheMultiSelectData(data: any): Array<{ name: string }> {
      return data.map((item: any) => {
        return { name: item };
      });
      // .filter(item => item.name !== '');
    }

    const isOpenPermissionDialog: ComputedRef<boolean> = computed(() => {
      return SaveSettingModule.isOpenSavePermissionDialog;
    });

    const Owners: ComputedRef = computed({
      get: () => SaveSettingModule.Owners,
      set: (value: Array<{ name: string }>) => {
        SaveSettingModule.setOwnersDATA(value);
      },
    });
    const Access: ComputedRef = computed({
      get: () => SaveSettingModule.Access,
      set: (value: Array<{ name: string }>) => {
        SaveSettingModule.setAccessDATA(value);
      },
    });

    const TableOptions: ComputedRef<Array<{ name: string }>> = computed(() => {
      return DataCollectionModule.tableOptions;
    });

    function close(shouldSync: boolean = false): void {
      SaveSettingModule.closeSavePermissionDialog();
      emit('closePermissionPopup', shouldSync);
    }

    async function save(e: Event) {
      e.stopPropagation();
      const reshapedOwner = Owners.value.map((i: any) => i.name);
      const reshapedAccess = Access.value.map((i: any) => i.name);
      // eslint-disable-next-line no-console
      // console.log("reshapedOwner",reshapedOwner)
      submitted.value = true;
      SaveSettingModule.savePermissionSetting({
        unixTime: unixTime.value,
        UsersQuery: UsersQuery.value,
        Owners: reshapedOwner,
        Access: reshapedAccess,
      });
      setTimeout(() => close(true), 900);
      //  this.close(true);
      // eslint-disable-next-line no-console
      console.log('inside fulfilled condition');
      // }
      // this.handleValidate(this.$v);
    }
    return {
      save,
      close,
      TableOptions,
      Access,
      Owners,
      isOpenPermissionDialog,
      reArrangetheMultiSelectData,
      SavedQuery,
      validOwner,
      queryData,
      submitted,
      UsersQuery,
      unixTime,
      Name,
      local_DCH_TABLE_ACCESS,
      local_DCH_TABLE_OWNERS,
    };
  },
});
</script>

<style module lang="scss">
.container {
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;

  &__window {
    width: 500px;
    height: 500px;
    position: fixed;
    background-color: white;
    border-radius: 5px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100000;
    padding: 30px;
    overflow: scroll;
    &::-webkit-scrollbar {
      width: 10px;
      height: 0;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 31px;
    }
  }

  &__body {
    margin: 20px;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    bottom: 0;
    left: 0;
    padding: 20px;
  }

  &__input {
    margin: 10px 0;
  }
}
.multiselect-label {
  margin-bottom: 9px;
}
</style>
