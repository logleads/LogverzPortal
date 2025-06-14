<template>
  <div class="fields-container">
    <div v-for="item in fields" :key="item.label" class="item-field">
      <div
        :class="[
          'item-field__key',
          {
            [decideDisplayError(item.label, item.value).classDisplay]: decideDisplayError(
              item.label,
              item.value,
            ).show,
          },
        ]"
      >
        {{ item.label }}:
      </div>
      <div class="item-field__value">{{ item.value }}</div>
    </div>
    <p class="warning-text">
      {{ DatasetWarning }}
    </p>
  </div>
</template>
<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  getCurrentInstance,
  onMounted,
  Ref,
  ref,
  watch,
} from 'vue';

import { ConnectionIndecatoreModule } from '~/store/modules/connection-indecatore';
import { DataCollectionModule } from '~/store/modules/data-collection';
// import { ErrorsModule } from '~/store/modules/errors';

// @Component({
//   name: 'Review',
// })
export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Review',
  props: {
    reviewExpend: {
      type: Boolean,
      required: false,
    },
    test: {
      type: String,
    },
  },

  setup(props) {
    const instance = getCurrentInstance();
    const vis: Ref<any> = ref(instance?.data);
    const DBStatus: Ref<string | null> = ref(null);
    let intervalId: any; // Define intervalId here

    const startInterval = () => {
      let elapsedSeconds = 0;
      intervalId = setInterval(() => {
        getServerStatus();

        elapsedSeconds += 5;
        if (elapsedSeconds >= 300) {
          clearInterval(intervalId);
        }
      }, 5000);
    };

    const stopInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
    onMounted(() => {
      watch(
        () => props.reviewExpend,
        newVal => {
          if (newVal) {
            startInterval();
          } else {
            stopInterval();
          }
        },
      );
    });

    function dataDisplay(param: any) {
      return param.value;
    }

    const decideDisplayError = (label: string, value: string) => {
      if (value === 'SetDataTypePlease' && label === 'DataType') {
        return { show: true, classDisplay: 'error' };
      } else if (value !== 'available' && label === 'DBinstance') {
        return { show: true, classDisplay: 'error' };
      } else if (!value) {
        if (label === 'DatasetAccess' || label === 'DatasetOwners') {
          return { show: true, classDisplay: 'warning' };
        }
        return { show: true, classDisplay: 'error' };
      } else {
        return { show: false, classDisplay: 'gray' };
      }
    };

    const DatasetWarning: ComputedRef<string> = computed(() => {
      return DataCollectionModule.DatasetWarning;
    });
    const AllocationStrategy: ComputedRef<string> = computed(() => {
      return DataCollectionModule.allocationStrategy;
    });

    const LogVolume: ComputedRef<string> = computed(() => {
      return DataCollectionModule.logVolume;
    });

    const DataType: ComputedRef<string> = computed(() => {
      return DataCollectionModule.DataType;
    });

    const QueryString: ComputedRef<string> = computed(() => {
      return DataCollectionModule.queryString;
    });

    const DatasetName: ComputedRef<string> = computed(() => {
      return DataCollectionModule.DatasetName;
    });

    const S3Folders: ComputedRef<string> = computed(() => {
      return DataCollectionModule.s3Folders;
    });

    const DatabaseParameters: ComputedRef<string> = computed(() => {
      return DataCollectionModule.databaseParameters;
    });

    const DatasetDescription: ComputedRef<string> = computed(() => {
      return DataCollectionModule.DatasetDescription;
    });

    const DatasetOwners: ComputedRef<string> = computed(() => {
      return DataCollectionModule.DatasetOwners.map(i => i.name).join(' , ');
    });

    const DatasetAccess: ComputedRef<string> = computed(() => {
      return DataCollectionModule.DatasetAccess.map(i => i.name).join(' , ');
    });

    const S3EnumerationDepth: ComputedRef<string> = computed(() => {
      return DataCollectionModule.s3EnumerationDepth;
    });

    const PreferedWorkerNumber: ComputedRef<string> = computed(() => {
      return DataCollectionModule.preferedWorkerNumber;
    });

    const DBinstance: ComputedRef<any> = computed(() => {
      let resp: any = ConnectionIndecatoreModule.DBinstanse;
      const instanceLocal = resp.find((ins: any) => ins.name == DatabaseParameters.value);

      return instanceLocal?.DBInstanceStatus;
    });

    function getServerStatus(): any {
      return ConnectionIndecatoreModule.getRTCStatuse();
    }
    const fields = computed(() => [
      { label: 'S3Folders', value: S3Folders.value },
      { label: 'LogVolume', value: LogVolume.value },
      { label: 'AllocationStrategy', value: AllocationStrategy.value },
      { label: 'DataType', value: DataType.value },
      { label: 'DatabaseParameters', value: DatabaseParameters.value },
      { label: 'DatasetName', value: DatasetName.value },
      { label: 'DatasetDescription', value: DatasetDescription.value },
      { label: 'DatasetOwners', value: DatasetOwners.value },
      { label: 'DatasetAccess', value: DatasetAccess.value },
      { label: 'S3EnumerationDepth', value: S3EnumerationDepth.value },
      { label: 'PreferedWorkerNumber', value: PreferedWorkerNumber.value },
      { label: 'QueryString', value: QueryString.value },
      { label: 'DBinstance', value: DBinstance.value },
    ]);

    watch(DBinstance, (value: any) => {
      if (value.length > 0 === value[0].DBInstanceStatus) {
        DBStatus.value = value[0].DBInstanceStatus;
      }
    });

    return {
      fields,
      DBinstance,
      PreferedWorkerNumber,
      S3EnumerationDepth,
      DatasetAccess,
      DatasetOwners,
      DatasetDescription,
      DatabaseParameters,
      S3Folders,
      DatasetName,
      QueryString,
      DataType,
      LogVolume,
      AllocationStrategy,
      DatasetWarning,
      decideDisplayError,
      vis,
      DBStatus,
      instance,
      dataDisplay,
    };
  },
});
</script>

<style scoped lang="scss">
.item-field {
  display: flex;
  align-items: center;
  margin: 15px 0;

  &__key {
    font-size: 14px;
    margin-right: 10px;
    color: #1a1b20;
    width: 200px;
    font-weight: bold;
  }

  &__value {
    font-size: 14px;
    max-width: 100%;
    overflow: hidden;
  }
}

.fields-container {
  margin-top: 23px;
  margin-bottom: 13px;
  background-color: var(--gray-background);
  border-radius: 5px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  padding: 21.5px 30px 25.5px 30px;
}

.error {
  color: red;
}

.warning {
  color: #dbba71;
}

.gray {
  color: #9fa6b1;
}

.warning-text {
  color: #dbba71;
  font-style: italic;
}
</style>
