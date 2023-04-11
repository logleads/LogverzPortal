<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<template>
  <div v-if="isOpenDeleteRecordDialog" :class="[$style['container']]" @click.self="close">
    <div :class="[$style['container__window']]">
      <div v-if="!checkSpecialCondition()" :class="[$style['container__body']]">
        <div :class="$style['delete-checkbox']">
          <input
            id="withRedirect"
            v-model="dataSetDelete"
            :class="$style['delete-checkbox__checkbox']"
            type="checkbox"
          />
          <p :class="$style['delete-checkbox__label']">Delete Dataset</p>
        </div>
      </div>
      <div :class="[$style['container__body']]">
        <div :class="$style['delete-checkbox']">
          <input
            id="withRedirect"
            v-model="RecordDelete"
            :class="$style['delete-checkbox__checkbox']"
            type="checkbox"
          />
          <p :class="$style['delete-checkbox__label']">Delete Record</p>
        </div>
      </div>
      <h4 v-if="RecordDelete && !dataSetDelete" :class="$style['warning-text']">
        The record is selected for deletion, collected data will <br />
        remain on the database server
      </h4>
      <br />
      <div v-if="dataSetDelete">
        <h3>Dataset Deletion Conditions</h3>
        <br />
        <h4 :class="[isConnected ? $style['green-text'] : $style['red-text']]">
          {{
            isConnected
              ? 'WebRTC connection Active'
              : 'WebRTC connection is not active, open Analysis so that the connection is established'
          }}
        </h4>
        <br />
        <br />
        <h4 :class="[DBinstance ? $style['green-text'] : $style['red-text']]">
          {{ DBinstance ? 'DBServer is in running state' : 'DBServer is not in running state' }}
        </h4>
      </div>
      <div :class="[$style['container__footer']]">
        <MyButton text="Cancel" @click="close" />
        <MyButton
          text="Delete"
          :disabled="!buttonDisable()"
          :no-load="true"
          @click="displayConfirmationDialog"
        />
      </div>
    </div>
    <ConfirmationPopup
      v-if="displayConfirmationPopup"
      @closeConfirmationPopup="closeConfirmationPopup"
      @SaveConfirmationPopup="SaveConfirmationPopup"
    />
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, Ref, ref, watch } from '@vue/composition-api';

import MyButton from '~/components/shared/button.vue';
import { DCH_TABLE_ACCESS, DCH_TABLE_OWNERS } from '~/constants';
import RTCServiceObj from '~/services/api/rtc-service';
import { SaveSettingService } from '~/services/api/save-setting-service';
import { ConnectionIndecatoreModule } from '~/store/modules/connection-indecatore';
import { SaveSettingModule } from '~/store/modules/save-setting';
import { ServerConnectionModule } from '~/store/modules/server-connection';

import ConfirmationPopup from './confirmation-popup.vue';

export default defineComponent({
  name: 'QueryHistoryDeleteRecord',
  components: {
    MyButton,
    ConfirmationPopup,
  },
  setup(props, { emit }) {
    const local_DCH_TABLE_ACCESS = DCH_TABLE_ACCESS;
    const local_DCH_TABLE_OWNERS = DCH_TABLE_OWNERS;
    const Name: Ref<string> = ref('');
    const unixTime: Ref<number> = ref(0);
    const UsersQuery: Ref<string> = ref('');
    const DatabaseParameters: Ref<string> = ref('');
    const TableName: Ref<string> = ref('');

    const dataBaseRunning: Ref<boolean> = ref(false);
    const webRtcActive: Ref<boolean> = ref(false);
    const displayConfirmationPopup: Ref<boolean> = ref(false);

    const RecordDelete: Ref<boolean> = ref(false);
    const dataSetDelete: Ref<boolean> = ref(false);

    const submitted: Ref<boolean> = ref(false);
    const queryData = ref([]);

    const validOwner: Ref<{ $invalid: boolean } | null> = ref(null);
    const canDeleteDataRecords: Ref<boolean> = ref(false);
    const SavedQuery: ComputedRef = computed(() => {
      let data = SaveSettingModule.savedData;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      unixTime.value = data.UnixTime;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      UsersQuery.value = data.UsersQuery;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      DatabaseParameters.value = data.DatabaseName;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      TableName.value = data.TableName;
      return data;
    });
    watch(SavedQuery, (value: any) => {
      unixTime.value = value.UnixTime;
      UsersQuery.value = value.UsersQuery;
      DatabaseParameters.value = value.DatabaseName;
    });

    const isConnected: ComputedRef<boolean> = computed(() => {
      return ServerConnectionModule.isConnectedToWebRTC;
    });
    // get DatabaseParameters(): string {
    //   return DataCollectionModule.databaseParameters;
    // }
    const DBinstance: ComputedRef<boolean> = computed(() => {
      // return
      let resp: any = ConnectionIndecatoreModule.DBinstanse;
      const instance = resp.find((ins: any) => ins.name == DatabaseParameters.value);

      return instance.DBInstanceStatus === 'available';
    });

    function checkSpecialCondition(): boolean {
      const { Active, QueryType } = SavedQuery.value;
      if (QueryType === 'A' || (QueryType === 'C' && !Active)) {
        return true;
      }
      return false;
    }

    function buttonDisable(): boolean {
      //TODO:
      if (RecordDelete.value || dataSetDelete.value) {
        if (dataSetDelete.value) {
          return isConnected.value && DBinstance.value;
        }
        return true;
      }
      return false;
    }

    function displayConfirmationDialog(e: Event) {
      // if(this.checkSpecialCondition()){
      displayConfirmationPopup.value = true;
      // }else{
      //   this.save(e);
      // }
    }

    function closeConfirmationPopup() {
      // eslint-disable-next-line no-console
      console.log('closeConfirmationPopup');
      displayConfirmationPopup.value = false;
    }
    async function SaveConfirmationPopup(e: Event) {
      displayConfirmationPopup.value = false;
      // eslint-disable-next-line no-console
      console.log('SaveConfirmationPopup', unixTime.value);
      if (dataSetDelete.value) {
        await RTCServiceObj.sendQuery(
          `{"LogverzDBFriendlyName":"${DatabaseParameters.value}","Mode":"DeleteTable","DBTableName":"${TableName.value}"}`,
        );
      }
      await SaveSettingService.deleteDataRecord({
        unixTime: unixTime.value,
        UsersQuery: UsersQuery.value,
        Archived: true,
      });

      save(e);
    }

    const isOpenDeleteRecordDialog: ComputedRef<boolean> = computed(() => {
      return SaveSettingModule.isOpenDeleteRecordDialog;
    });

    function close(shouldSync: boolean = false): void {
      SaveSettingModule.closeDeleteRecordDialog();
      dataSetDelete.value = false;
      RecordDelete.value = false;
      emit('closePermissionPopup', shouldSync);
    }

    async function save(e: Event) {
      // e.stopPropagation();
      submitted.value = true;
      //  SaveSettingModule.savePermissionSetting({unixTime: this.unixTime, UsersQuery: this.UsersQuery, Owners: reshapedOwner, Access: reshapedAccess});
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
      isOpenDeleteRecordDialog,
      SaveConfirmationPopup,
      closeConfirmationPopup,
      displayConfirmationDialog,
      buttonDisable,
      checkSpecialCondition,
      DBinstance,
      isConnected,
      SavedQuery,
      local_DCH_TABLE_ACCESS,
      local_DCH_TABLE_OWNERS,
      Name,
      unixTime,
      UsersQuery,
      DatabaseParameters,
      TableName,
      dataBaseRunning,
      webRtcActive,
      displayConfirmationPopup,
      RecordDelete,
      dataSetDelete,
      submitted,
      queryData,
      validOwner,
      canDeleteDataRecords,
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
.delete-checkbox {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 90%;
  margin-right: 76px;
  margin-bottom: 20px;

  &__checkbox {
    margin-right: 20px;
  }

  &__label {
    font-weight: 500;
    font-size: 15px;
    color: var(--ink-color);
  }
}
.multiselect-label {
  margin-bottom: 9px;
}
.warning-text {
  color: #dbba71;
  font-style: italic;
}
.green-text {
  color: #66eb48;
  font-style: italic;
}
.red-text {
  color: #a81900;
  font-style: italic;
}
</style>
