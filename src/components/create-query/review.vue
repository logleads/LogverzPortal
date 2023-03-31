<template>
  <div :class="$style['fields-container']">
    <div v-for="item in fields" :key="item.label" :class="$style['item-field']">
      <div
        :class="[
          $style['item-field__key'],
          {
            [$style[decideDisplayError(item.label, item.value.value).classDisplay]]:
              decideDisplayError(item.label, item.value.value).show,
          },
        ]"
      >
        {{ item.label }}:
      </div>
      <div :class="$style['item-field__value']">{{ item.value.value }}</div>
    </div>
    <p :class="$style['warning-text']">
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
} from '@vue/composition-api';

import { ConnectionIndecatoreModule } from '~/store/modules/connection-indecatore';
import { DataCollectionModule } from '~/store/modules/data-collection';
// import { ErrorsModule } from '~/store/modules/errors';

// @Component({
//   name: 'Review',
// })
export default defineComponent({
  name: 'Review',
  setup() {
    const instance = getCurrentInstance();
    const vis: Ref<any> = ref(instance?.data);
    const DBStatus: Ref<string | null> = ref(null);
    // console.log(vis)
    onMounted(() => {
      console.log('instance', instance);
    });
    function dataDisplay(param: any) {
      return param.value;
    }
    const decideDisplayError = (label: string, value: string) => {
      // // eslint-disable-next-line no-console
      // console.log(label, '==>>', this);

      if (value === 'SetDataTypePlease' && label === 'DataType') {
        //TODO: changes expected here
        return { show: true, classDisplay: 'error' };
      } else if (value !== 'available' && label === 'DBinstance') {
        return { show: true, classDisplay: 'error' };
      } else if (!value) {
        if (label === 'DatasetAccess' || label === 'DatasetOwners') {
          return { show: true, classDisplay: 'warning' };
        }
        return { show: true, classDisplay: 'error' };
      } else {
        // return false
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
      console.log(vis, this);
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
      // return
      let resp: any = ConnectionIndecatoreModule.DBinstanse;
      const instanceLocal = resp.find((ins: any) => ins.name == DatabaseParameters.value);

      return instanceLocal.DBInstanceStatus;
    });

    const fields = ref([
      { label: 'S3Folders', value: S3Folders },
      { label: 'LogVolume', value: LogVolume },
      { label: 'AllocationStrategy', value: AllocationStrategy },
      { label: 'DataType', value: DataType },
      { label: 'DatabaseParameters', value: DatabaseParameters },
      { label: 'DatasetName', value: DatasetName },
      { label: 'DatasetDescription', value: DatasetDescription },
      { label: 'DatasetOwners', value: DatasetOwners },
      { label: 'DatasetAccess', value: DatasetAccess },
      { label: 'S3EnumerationDepth', value: S3EnumerationDepth },
      { label: 'PreferedWorkerNumber', value: PreferedWorkerNumber },
      { label: 'QueryString', value: QueryString },
      { label: 'DBinstance', value: DBinstance },
    ]);
    watch(DBinstance, (value: any) => {
      // eslint-disable-next-line no-console
      console.log('**watchConnectionIndicator**: ', value);
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

<style module lang="scss">
.item-field {
  display: flex;
  align-items: center;
  margin: 15px 0;
  &__key {
    font-size: 14px;
    margin-right: 10px;
    color: var(--secondary-text-color);
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

function elseif(arg0: boolean) { throw new Error('Function not implemented.'); }
