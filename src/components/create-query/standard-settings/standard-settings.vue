<template>
  <div :class="$style['standard']">
    <template v-if="!isFetching">
      <template v-if="!IsFetchingQuery">
        <template v-if="!listLoader">
          <TreeList :list-folder="listFolder" />
        </template>
        <template v-else>
          <div :class="$style['standard__loader']">
            <Loader accent />
          </div>
        </template>
        <div v-for="input in S3FoldersValue" :key="input.label" :class="$style['customeClass']">
          <InputContainer :label="input.label"  >
            <template #icon>
              <ToolTip :tip="input.hint" />
            </template>
            <template #input>
              <Input
                v-model="input.content"
                :name="input.label"
                :error="submitted && v$[input.label]?.$error"
                :class="$style['standard__add-file__input']"
                @input="handleInput({ value: $event.target.value, label: input.label })"
              />
            </template>
          </InputContainer>
          <div v-if="submitted && v$[input.label]?.$error" :class="$style['validation-text']">
            {{ input.label }} is required
          </div>
          <div
            v-if="
              submitted &&
              (v$[input.label].maxLength.$invalid || v$[input.label].maxLength.$invalid)
            "
          >
            {{ v$[input.label].maxLength.$message }}
          </div>
        </div>
        <!-- <label for="s3folder" :class="$style['standard__file-label']"
          >S3Folders
          <span>
            <ToolTip :tip="DCH_S3_FOLDERS_Local" />
          </span>
        </label> -->
        <!-- <div
          :class="[
            $style['standard__add-file'],
            {
              [$style['error']]: submitted && v$.S3Folders?.$error,
            },
          ]"
        >
          <Input
            id="s3folder"
            v-model="S3FoldersValue"
            name="S3Folders"
            :class="$style['standard__add-file__input']"
            @input="handleInput({ value: $event, label: 'S3Folders' })"
          />
           @input="data => handleInput({ value: data, label: 'S3Folders' })"
        </div> -->
        <!-- <div v-if="submitted && v$.S3Folders?.$error" :class="$style['validation-text']">
          S3Folders is required
        </div>
        <div
          v-if="submitted && (v$.S3Folders.minLength.$invalid || v$.S3Folders.maxLength.$invalid)"
          :class="$style['validation-text']"
        >
          <template v-if="v$.S3Folders.minLength.$invalid"
            >{{ v$.S3Folders.minLength.$message }}
          </template>
          <template v-if="v$.S3Folders.maxLength.$invalid"
            >{{ v$.S3Folders.maxLength.$message }}
          </template>
        </div> -->
        <div v-if="isFilesBrowses">
          <div :class="$style['standard__sites']">
            <SiteItem :path="Path" :deep="1" :root-folder-fetching="rootFolderFetching" />
          </div>
        </div>

        <div :class="$style['standard__inputs']">
          <div v-for="select in selects" :key="select.label">
            <label :class="$style['customLabel']">
              <span>{{ select.label }}</span>
              <ToolTip :tip="select.hint" />
            </label>
            <DropDownSimple
              :content="select.content"
              :items="select.items"
              :name="select.label"
              @select-value="handleInputSelect"
            />
          </div>
          <div v-for="input in inputs" :key="input.label">
            <InputContainer :label="input.label">
              <template #icon>
                <ToolTip :tip="input.hint" />
              </template>
              <template #input>
                <Input
                  v-model="input.content"
                  :name="input.label"
                  :error="submitted && v$[input.label]?.$error"
                  :class="$style['standard__add-file__input']"
                  @input="handleInput({ value: $event.target.value, label: input.label })"
                />
              </template>
            </InputContainer>
            <div v-if="submitted && v$[input.label]?.$error" :class="$style['validation-text']">
              {{ input.label }} is required
            </div>
            <div
              v-if="
                submitted &&
                (v$[input.label].maxLength.$invalid || v$[input.label].maxLength.$invalid)
              "
            >
              {{ v$[input.label].maxLength.$message }}
            </div>
          </div>
          <div>
            <label :class="$style['multiselect-label']">
              <span> Dataset Owners </span>
              <ToolTip :tip="DCH_TABLE_OWNERS_Local" />
            </label>
            <div>
              <multiselect
                v-model="DatasetOwners"
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
                :class="{ invalid: submitted && v$.DatasetOwners?.$error }"
              />
            </div>

            <div v-if="submitted && v$.DatasetOwners?.$error" :class="$style['validation-text']">
              DatasetOwners is required
            </div>
          </div>
          <div>
            <label :class="$style['multiselect-label']">
              <span> Dataset Access </span>
              <ToolTip :tip="DCH_TABLE_ACCESS_Local" />
            </label>
            <div>
              <multiselect
                v-model="DatasetAccess"
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
          </div>
        </div>
      </template>
      <template v-else>
        <Loader accent />
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import Multiselect from 'vue-multiselect';

import SiteItem from '~/components/create-query/standard-settings/site-item.vue';
import DropDownSimple from '~/components/shared/drop-down-simple.vue';
import Input from '~/components/shared/input.vue';
import InputContainer from '~/components/shared/input-container.vue';
import Loader from '~/components/shared/loader.vue';
import ToolTip from '~/components/shared/tool-tip.vue';
import {
  DCH_AVAILABLE_BUCKETS,
  DCH_DB_SERVER_ALIAS,
  DCH_LOG_VOLUME,
  DCH_QUERY_TYPE_SELECTOR,
  DCH_S3_FOLDERS,
  DCH_TABLE_ACCESS,
  DCH_TABLE_DESCRIPTION,
  DCH_TABLE_NAME,
  DCH_TABLE_OWNERS,
  notShowDatatypeSelector,
} from '~/constants';
import { DataCollectionModule } from '~/store/modules/data-collection';
import { InputContent } from '~/types/models/data-collection-types';

import { employees } from './data';
import TreeList from './tree-list.vue';
const emptySelectedText = 'Nobody has been selected';
import { useVuelidate } from '@vuelidate/core';
import { maxLength, minLength, required } from '@vuelidate/validators';
import {
  computed,
  ComputedRef,
  defineComponent,
  onMounted,
  Ref,
  ref,
  watch,
  WritableComputedRef,
} from 'vue';

export default defineComponent({
  name: 'StandardSettings',
  components: {
    ToolTip,
    Loader,
    DropDownSimple,
    SiteItem,
    InputContainer,
    // eslint-disable-next-line vue/no-reserved-component-names
    Input,
    Multiselect,
    TreeList,
  },
  props: {
    submitted: {
      type: Boolean,
      required: false,
    },
    isFetching: {
      type: Boolean,
      required: false,
    },
  },
  setup(props, { emit }) {
    const employees1 = ref(employees);
    const expandedRowKeys = ref([1, 2]);
    const selectedRowKeys = ref([]);
    const isFilesBrowses = ref(false);
    const value = ref(null);
    const selectedEmployeeNames = ref(emptySelectedText);
    const selectionMode = ref('all');
    const DCH_AVAILABLE_BUCKETS_LOCAL = ref(DCH_AVAILABLE_BUCKETS);
    const DCH_S3_FOLDERS_Local = ref(DCH_S3_FOLDERS);
    const DCH_LOG_VOLUME_Local = ref(DCH_LOG_VOLUME);
    const DCH_QUERY_TYPE_SELECTOR_Local = ref(DCH_QUERY_TYPE_SELECTOR);
    const DCH_DB_SERVER_ALIAS_Local = ref(DCH_DB_SERVER_ALIAS);
    const DCH_TABLE_NAME_Local = ref(DCH_TABLE_NAME);
    const DCH_TABLE_DESCRIPTION_Local = ref(DCH_TABLE_DESCRIPTION);
    const DCH_TABLE_OWNERS_Local = ref(DCH_TABLE_OWNERS);
    const DCH_TABLE_ACCESS_Local = ref(DCH_TABLE_ACCESS);
    const rules = {
      CurrentBucket: { required },
      DBServerAlias: { required },
      S3Folders: { required, minLength: minLength(6), maxLength: maxLength(2000) },
      LogVolume: { required },
      DatatypeSelector: { required },
      DatasetName: { required, minLength: minLength(1), maxLength: maxLength(63) },
      DatasetDescription: { required, maxLength: maxLength(500) },
    };

    const DatasetOwners = computed({
      get() {
        return DataCollectionModule.DatasetOwners;
      },
      set(value: Array<{ name: string }>) {
        DataCollectionModule.setMultiSelect({ label: 'DatasetOwners', value });
      },
    });

    const listFolder = computed(() => {
      return DataCollectionModule.listFolder;
    });

    const DatasetAccess = computed({
      get() {
        return DataCollectionModule.DatasetAccess;
      },
      set(value: Array<{ name: string }>) {
        DataCollectionModule.setMultiSelect({ label: 'DatasetAccess', value });
      },
    });

    // public DatasetAccess = DataCollectionModule.DatasetAccess;

    function minLengthMessage(minLength: number): string {
      return `Minimum length is ${minLength}`;
    }

    function maxLengthMessage(maxLength: number): string {
      return `Maximum length is ${maxLength}`;
    }

    const rootFolderFetching: ComputedRef<boolean> = computed(() => {
      return DataCollectionModule.rootFolderFetching;
    });

    const listLoader: ComputedRef<boolean> = computed(() => {
      return DataCollectionModule.listLoader;
    });

    const IsFetchingQuery: ComputedRef<boolean> = computed(() => {
      return DataCollectionModule.isFetchSettingsParams;
    });

    const Path = computed(() => {
      return DataCollectionModule.pathObj;
    });

    const DatatypeSelector: ComputedRef<string> = computed(() => {
      // eslint-disable-next-line no-console
      // console.log('DatatypeSelector', DataCollectionModule.DataType);
      return DataCollectionModule.DataType;
    });

    const Buckets: ComputedRef<Array<string>> = computed(() => {
      return DataCollectionModule.buckets;
    });

    const isBucketsFetching: ComputedRef<boolean> = computed(() => {
      return DataCollectionModule.isBucketsFetching;
    });

    const QueryTypeItems: ComputedRef<Array<string>> = computed(() => {
      // eslint-disable-next-line no-console
      // console.log('QueryTypeItems', DataCollectionModule.queryTypesItems);
      let resp = DataCollectionModule.queryTypesItems
        .filter(item => !notShowDatatypeSelector.includes(item))
        .reduce((acc: string[], i: string) => {
          if (i.toLowerCase().includes('set')) {
            return [i, ...acc];
          } else {
            return [...acc, i];
          }
        }, []);
      // eslint-disable-next-line no-console

      return resp;
    });

    const DatasetName: ComputedRef<string> = computed(() => {
      return DataCollectionModule.DatasetName;
    });

    const S3Folders = computed(() => {
      return DataCollectionModule.s3Folders;
    });

    const DBServerAlias: ComputedRef<string> = computed(() => {
      return DataCollectionModule.databaseParameters;
    });

    const DatasetDescription: ComputedRef<string> = computed(() => {
      return DataCollectionModule.DatasetDescription;
    });

    const LogVolume: ComputedRef<string> = computed(() => {
      // eslint-disable-next-line no-console
      // console.log('LOG VOLUME', DataCollectionModule.logVolume);

      return DataCollectionModule.logVolume;
    });

    const TableOptions: ComputedRef<Array<{ name: string }>> = computed(() => {
      return DataCollectionModule.tableOptions;
    });

    const DBServerItems: ComputedRef<Array<string>> = computed(() => {
      return DataCollectionModule.databaseParamItems;
    });

    const CurrentBucket: ComputedRef<string> = computed(() => {
      return DataCollectionModule.currentBucket;
    });
    const selects: Ref<
      Array<{
        label: string;
        content: string;
        items: Array<string>;
        hint: string;
      }>
    > = ref([
      {
        label: 'LogVolume',
        content: LogVolume.value,
        items: ['small', 'medium', 'large'], //'micro',
        hint: DCH_LOG_VOLUME_Local.value,
      },
      {
        label: 'DatatypeSelector',
        content: DatatypeSelector.value,
        items: QueryTypeItems.value,
        hint: DCH_QUERY_TYPE_SELECTOR_Local.value,
      },
      {
        label: 'DBServerAlias',
        content: DBServerAlias.value,
        items: DBServerItems.value,
        hint: DCH_DB_SERVER_ALIAS_Local.value,
      },
    ]);
    const v$ = useVuelidate(rules, {
      CurrentBucket,
      DBServerAlias,
      S3Folders,
      LogVolume,
      DatatypeSelector,
      DatasetName,
      DatasetDescription,
    });
    onMounted(() => {
      DataCollectionModule.getQueryType();
      DataCollectionModule.getDBAlias();
      DataCollectionModule.getBuckets();

      // emit('validate', v$);
    });
    watch(CurrentBucket, async (value: string) => {
      DataCollectionModule.rootFolderFetch(true);
      await DataCollectionModule.getPath('s3://' + value);
      DataCollectionModule.rootFolderFetch(false);
    });
    watch(DatatypeSelector, value => {
      DataCollectionModule.getTableParametersList(value);
      // console.log('first', DatatypeSelector.value);
      // console.log('second', value);
      selects.value = [
        {
          label: 'LogVolume',
          content: LogVolume.value,
          items: ['small', 'medium', 'large'], // 'micro',
          hint: DCH_LOG_VOLUME_Local.value,
        },
        {
          label: 'DatatypeSelector',
          content: DatatypeSelector.value,
          items: QueryTypeItems.value,
          hint: DCH_QUERY_TYPE_SELECTOR_Local.value,
        },
        {
          label: 'DBServerAlias',
          content: DBServerAlias.value,
          items: DBServerItems.value,
          hint: DCH_DB_SERVER_ALIAS_Local.value,
        },
      ];
    });

    watch(DatasetAccess, (value: Array<{ name: string }>) => {
      DataCollectionModule.setMultiSelect({ label: 'DatasetAccess', value });
    });

    watch(QueryTypeItems, () => {
      selects.value = [
        {
          label: 'LogVolume',
          content: LogVolume.value,
          items: ['small', 'medium', 'large'], // 'micro',
          hint: DCH_LOG_VOLUME_Local.value,
        },
        {
          label: 'DatatypeSelector',
          content: DatatypeSelector.value,
          items: QueryTypeItems.value,
          hint: DCH_QUERY_TYPE_SELECTOR_Local.value,
        },
        {
          label: 'DBServerAlias',
          content: DBServerAlias.value,
          items: DBServerItems.value,
          hint: DCH_DB_SERVER_ALIAS_Local.value,
        },
      ];
    });

    watch(DBServerItems, () => {
      selects.value = [
        {
          label: 'LogVolume',
          content: LogVolume.value,
          items: ['small', 'medium', 'large'], //'micro',
          hint: DCH_LOG_VOLUME_Local.value,
        },
        {
          label: 'DatatypeSelector',
          content: DatatypeSelector.value,
          items: QueryTypeItems.value,
          hint: DCH_QUERY_TYPE_SELECTOR_Local.value,
        },
        {
          label: 'DBServerAlias',
          content: DBServerAlias.value,
          items: DBServerItems.value,
          hint: DCH_DB_SERVER_ALIAS_Local.value,
        },
      ];
    });
    const S3FoldersValue = computed(() => {
      return [
        {
          label: 'S3Folders',
          content: S3Folders.value,
          hint: DCH_S3_FOLDERS_Local.value,
        },
      ];
    });

    const inputs = computed(() => {
      return [
        { label: 'DatasetName', content: DatasetName.value, hint: DCH_TABLE_NAME_Local.value },
        {
          label: 'DatasetDescription',
          content: DatasetDescription.value,
          hint: DCH_TABLE_DESCRIPTION_Local.value,
        },
      ];
    });

    function handleInputSelect(payload: { item: string; content: string }): void {
      let currentLabel = 'LogVolume';
      selects.value.forEach(select => {
        if (select.content === payload.content) {
          currentLabel = select.label;
        }
      });

      DataCollectionModule.setSelectValue({ label: currentLabel, value: payload.item });

      selects.value = [
        {
          label: 'LogVolume',
          content: LogVolume.value,
          items: ['small', 'medium', 'large'], //'micro',
          hint: DCH_LOG_VOLUME_Local.value,
        },
        {
          label: 'DatatypeSelector',
          content: DatatypeSelector.value,
          items: QueryTypeItems.value,
          hint: DCH_QUERY_TYPE_SELECTOR_Local.value,
        },
        {
          label: 'DBServerAlias',
          content: DBServerAlias.value,
          items: DBServerItems.value,
          hint: DCH_DB_SERVER_ALIAS_Local.value,
        },
      ];
      verifyValidation();
      emit('validate', v$);
    }

    function verifyValidation() {
      v$.value.$touch();
      console.log(v$.value);
    }

    function handleBucketsSelect(payload: { item: string; content: string }): void {
      DataCollectionModule.setSelectValue({ label: 'CurrentBucket', value: payload.item });
    }

    function handleInput(payload): void {
      console.log('Standard Setting', payload);
      if (payload.label == 'DatasetName') {
        DataCollectionModule.setInputValue({ label: 'DatasetWarning', value: '' });
      }
      // console.log('first', payload);
      DataCollectionModule.setInputValue(payload);
      verifyValidation();
      emit('validate', v$);
    }

    function browseFiles(): void {
      isFilesBrowses.value = !isFilesBrowses.value;
    }
    return {
      browseFiles,
      handleInput,
      handleBucketsSelect,
      handleInputSelect,
      inputs,
      selects,
      CurrentBucket,
      DBServerItems,
      TableOptions,
      LogVolume,
      DatasetDescription,
      DBServerAlias,
      S3Folders,
      DatasetName,
      QueryTypeItems,
      isBucketsFetching,
      Buckets,
      DatatypeSelector,
      Path,
      IsFetchingQuery,
      listLoader,
      rootFolderFetching,
      maxLengthMessage,
      minLengthMessage,
      DatasetAccess,
      DatasetOwners,
      listFolder,
      expandedRowKeys,
      selectedRowKeys,
      isFilesBrowses,
      value,
      selectedEmployeeNames,
      selectionMode,
      DCH_AVAILABLE_BUCKETS_LOCAL,
      DCH_S3_FOLDERS_Local,
      DCH_LOG_VOLUME_Local,
      DCH_QUERY_TYPE_SELECTOR_Local,
      DCH_DB_SERVER_ALIAS_Local,
      DCH_TABLE_NAME_Local,
      DCH_TABLE_DESCRIPTION_Local,
      DCH_TABLE_OWNERS_Local,
      DCH_TABLE_ACCESS_Local,
      v$,
      S3FoldersValue,
    };
  },
});
</script>

<style module lang="scss">
.selected-site {
  color: #4b75ed;
}
.customeClass{
  margin-top: 10px;
  padding-right: 9px !important;
}
.standard {
  margin-top: 23px;
  background-color: var(--gray-background);
  border-radius: 5px;
  padding: 18px 0 0 20px;

  &__select-single {
    max-width: 728px;
    margin-bottom: 30px;
  }

  &__file-label {
    margin-top: 20px;
    display: flex;
    align-items: center;

    > span {
      margin-left: 6px;
    }
  }
.customLabel{
  margin-bottom: 5px;
}
  &__inputs {
    // margin-top: 49px;
    max-width: 99%;
    padding-bottom: 59px;

    > div {
      // margin-bottom: 29px;
      margin-top: 10px;
    }
  }

  &__sites {
    > h1 {
      font-weight: 500;
      font-size: 16px;
      display: flex;
      align-items: center;
      margin-bottom: 7px;
      cursor: pointer;

      > span {
        margin-right: 7.24px;
      }
    }
  }

  &__loader {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  &__add-file {
    width: 99%;
    max-width: 100%;
    height: 44px;
    background-color: #ffffff;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 9px;
    // margin-bottom: 29px;

    &__button {
      width: 107px;
      height: 32px;
      background: var(--accent-color);
      border-radius: 3.04px;
      font-weight: 500;
      font-size: 12px;
      color: #ffffff;
      cursor: pointer;
      margin-right: 6px;
    }

    &__input {
      width: 100%;
      input {
        height: 42px;
      }
    }
  }

  label {
    font-size: 12px;
    line-height: 100%;
    display: flex;
    align-items: center;
    color: var(--secondary-text-color);

    > span {
      margin-right: 6px;
    }
  }

  input[type='file'] {
    display: none;
  }
}

.error {
  border-color: red;
}
.validation-text {
  color: red;
  font-size: 12px;
  margin: 10px auto;
}
.multiselect-label {
  margin-bottom:5px;
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
</style>
