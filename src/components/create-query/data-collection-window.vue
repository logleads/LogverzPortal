<template>
  <div class="con">
    <LoadSettings v-if="showLoadSettings" @toggleForm="toggleLoadSettings" />
    <div class="data__body">
      <!-- <h1 class="data__body__title">Create query</h1> -->
      <div v-if="Azure" class="cloud">
        <h3>Your cloud, your choice!</h3>
        <span>Will you be analysing data from Azure or AWS? Click on the source of the data.</span>
        <!-- <div class="cloud-tab">
          <div class="tooltip">
            <img 
              :src="require('~/assets/images/aws.png')" 
              alt="AWS" 
              class="aws"
              @click="() => handleActiveSettings('aws')" 
            />
            <span class="tooltiptext">{{ AWS_ICON_DESCRIPTION_LOCAL }}</span>
          </div>
          <div class="tooltip">
            <img :src="require('~/assets/images/azure.png')" alt="AWS" class="aws"
            @click="() => handleActiveSettings('azure')" />
            <span class="tooltiptext">{{ AZURE_ICON_DESCRIPTION_LOCAL }}</span>
          </div>
        </div> -->
        <div class="cloud-tab">
          <div class="tooltip cloud-option" :class="{ selected: activeSettings.aws }"
            @click="handleActiveSettings('aws')">
            <div class="checkmark" v-if="activeSettings.aws">✔</div>
            <img :src="require('~/assets/images/aws.png')" alt="AWS" class="cloud-img" />
            <span class="tooltiptext">{{ AWS_ICON_DESCRIPTION_LOCAL }}</span>
          </div>

          <div class="tooltip cloud-option" :class="{ selected: activeSettings.azure }"
            @click="handleActiveSettings('azure')">
            <div class="checkmark" v-if="activeSettings.azure">✔</div>
            <img :src="require('~/assets/images/azure.png')" alt="Azure" class="cloud-img" />
            <span class="tooltiptext">{{ AZURE_ICON_DESCRIPTION_LOCAL }}</span>
          </div>
        </div>

      </div>
      <div class="data__creation">
        <div class="data__creation__line" />
        <div v-for="item in setupArray" :key="item.id" class="data__creation__item">
          <span class="data__creation__item__numbers">{{ item.id + 1 }} </span>
          <p v-if="item.id === 3" class="data__creation__item__hide-line" />

          <DropDownCreate :label="item.label" @onPress="toggleExpanded">
            <template v-if="item.id === 0">
              <StandardSettings :submitted="submitted" :is-fetching="isFetching" :active-settings="activeSettings"
                @validate="handleValidate($event, 'standard')" />
            </template>
            <template v-if="item.id === 1">
              <AdvancedSettings :submitted="submitted" :is-fetching="isFetching"
                @validate="handleValidate($event, 'advanced')" />
            </template>
            <template v-if="item.id === 2">
              <CollectionRules :submitted="submitted" :is-fetching="isFetching"
                @validate="handleValidate($event, 'collection')" />
            </template>
            <template v-if="item.id === 3">
              <Review :review-expend="isReviewExpanded" />
            </template>
          </DropDownCreate>
        </div>
      </div>
      <div class="additional-settings">
        <p class="additional-settings__label">Check progress of data collection</p>
        <input id="withRedirect" v-model="withRedirect" class="additional-settings__checkbox" type="checkbox" />
      </div>
      <div class="data__body__footer">
        <button class="data__body__footer__btn" @click="toggleLoadSettings(true)">
          Load Configuration
        </button>

        <MyButton text="Submit" :classAssign="'_btn-submit'" :disabled="isFetching || !isDatatypeDefined || !DBinstanse"
          :no-load="!isDatatypeDefined || !DBinstanse" @click="handleSubmit($event)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref, watch } from 'vue';

import AdvancedSettings from '~/components/create-query/advanced-settings.vue';
import CollectionRules from '~/components/create-query/collection-rules/collection-rules.vue';
import LoadSettings from '~/components/create-query/load-settings/load-settings.vue';
import Review from '~/components/create-query/review.vue';
import StandardSettings from '~/components/create-query/standard-settings/standard-settings.vue';
import MyButton from '~/components/shared/button.vue';
import DropDownCreate from '~/components/shared/drop-down-create.vue';
import { REGION, AWS_ICON_DESCRIPTION, AZURE_ICON_DESCRIPTION } from '~/constants';
import { AdminModule } from '~/store/modules/admin';
import { ConnectionIndecatoreModule } from '~/store/modules/connection-indecatore';
import { DataCollectionModule } from '~/store/modules/data-collection';
import { WindowsModule } from '~/store/modules/windows';
import { JobConfigType } from '~/types/models/data-collection-types';
import ToolTip from '~/components/shared/tool-tip.vue';
import { server } from 'typescript';

export default defineComponent({
  name: 'DataCollectionWindow',
  components: {
    LoadSettings,
    Review,
    DropDownCreate,
    StandardSettings,
    AdvancedSettings,
    CollectionRules,
    MyButton,
    ToolTip
  },
  setup() {
    const validStandard: Ref<any> = ref(null);
    const validAdvanced: Ref<any> = ref(null);
    const validCollection: Ref<any> = ref(null);
    const activeSettings = ref({
      aws: true,
      azure: false,
    });
    const withRedirect = ref(false);
    const submitted = ref(false);
    const isReviewExpanded = ref(false);

    const isDatatypeDefined = ref(false);
    const showLoadSettings = ref(false);
    const setupArray: Ref<Array<{ id: number; label: string }>> = ref([
      { id: 0, label: 'Standard Settings' },
      { id: 1, label: 'Advanced Settings' },
      { id: 2, label: 'Collection Rules' },
      { id: 3, label: 'Review' },
    ]);

    const AWS_ICON_DESCRIPTION_LOCAL = ref(AWS_ICON_DESCRIPTION);
    const AZURE_ICON_DESCRIPTION_LOCAL = ref(AZURE_ICON_DESCRIPTION);

    const isFetching: ComputedRef<boolean> = computed(() => {
      return DataCollectionModule.isFetching;
    });
    const isJobCreated: ComputedRef<boolean> = computed(() => {
      return DataCollectionModule.jobCreated;
    });
    const Azure: ComputedRef<boolean> = computed(() => {
      return AdminModule.permissions.Azure;
    });


    watch(isJobCreated, (value: boolean) => {
      if (value) {
        if (withRedirect.value) {
          window.open(
            `https://${REGION}.console.aws.amazon.com/codesuite/codebuild/projects?region=${REGION}`,
            '_blank',
          );
        }

        WindowsModule.closeWindow(0); // TO DO 1
      }
    });

    onMounted(() => {
      DataCollectionModule.getListFolders();
      if (AdminModule.permissions.Azure) {

        DataCollectionModule.getAzureListFolders()
      }
      DataCollectionModule.initStartJob();
      if(DataCollectionModule.tableOptions.length === 0){
        DataCollectionModule.getDatasetAccessParameters();
      }
      // DataCollectionModule.getTableType("random");
    });

    function toggleLoadSettings(value: boolean): void {
      showLoadSettings.value = value;
    }

    function handleValidate(validation: any, setting: string): void {
      // console.log('emit roger', validation.value, setting);
      switch (setting) {
        case 'standard':
          validStandard.value = validation.value;
          break;
        case 'advanced':
          validAdvanced.value = validation.value;
          break;
        case 'collection':
          validCollection.value = validation.value;
          break;
      }
    }

    const startJobBody: ComputedRef<JobConfigType> = computed(() => {
      const DatasetAccess = DataCollectionModule.DatasetAccess.map(i => i.name);
      const DatasetOwners = DataCollectionModule.DatasetOwners.map(i => i.name);

      return {
        S3Folders: DataCollectionModule.s3Folders,
        S3EnumerationDepth: DataCollectionModule.s3EnumerationDepth,
        DataType: DataCollectionModule.DataType,
        QueryString: DataCollectionModule.queryString,
        LogVolume: DataCollectionModule.logVolume,
        AllocationStrategy: DataCollectionModule.allocationStrategy,
        PreferedWorkerNumber: DataCollectionModule.preferedWorkerNumber,
        DatabaseParameters: DataCollectionModule.databaseParameters,
        DatasetName: DataCollectionModule.DatasetName,
        DatasetDescription: DataCollectionModule.DatasetDescription,
        DatasetOwners,
        DatasetAccess,
      };
    });
    const toggleExpanded = (expend: boolean) => {
      isReviewExpanded.value = expend;

    }
    function handleSubmit(e: Event): void {
      e.stopPropagation();
      submitted.value = true;
      console.log('standard', validStandard.value?.$invalid);
      // validAdvanced.value.$touch();
      console.log('advance', validStandard.value?.$invalid);
      console.log('collection', validCollection.value?.$invalid);
      if (
        !validStandard.value?.$invalid &&
        !validAdvanced.value?.$invalid &&
        !validCollection.value?.$invalid
      ) {
      }
      DataCollectionModule.startJob(startJobBody.value);
    }
    const DataType: ComputedRef<string> = computed(() => {
      return DataCollectionModule.DataType;
    });

    const DBinstanse: ComputedRef<any> = computed(() => {
      // Find the active database instance
      const activeDBInstanse = ConnectionIndecatoreModule.DBinstanse?.find(
        (item) => item.name === startJobBody?.value?.DatabaseParameters
      );
      // Ensure that activeDBInstanse has DBInstanceStatus property
      return activeDBInstanse && 'DBInstanceStatus' in activeDBInstanse && activeDBInstanse.DBInstanceStatus === 'available';
    });

    watch(DataType, (value: string) => {
      if (value !== 'SetDataTypePlease') {
        isDatatypeDefined.value = true;
      } else {
        isDatatypeDefined.value = false;
      }
    });
    const handleActiveSettings = async(server: string) => {
      
      
      
      if (server === 'aws') {
        DataCollectionModule.setFoldersPathHard([]);
        activeSettings.value.aws = true
        activeSettings.value.azure = false

      } else {
        DataCollectionModule.setBlobFoldersPathHard([])
        activeSettings.value.aws = false
        activeSettings.value.azure = true

      }
    }
    return {
      DBinstanse,
      DataType,
      handleSubmit,
      startJobBody,
      handleValidate,
      toggleLoadSettings,
      isJobCreated,
      isFetching,
      validStandard,
      validAdvanced,
      validCollection,
      withRedirect,
      submitted,
      isDatatypeDefined,
      showLoadSettings,
      setupArray,
      toggleExpanded,
      isReviewExpanded,
      Azure,
      handleActiveSettings,
      activeSettings,
      AZURE_ICON_DESCRIPTION_LOCAL,
      AWS_ICON_DESCRIPTION_LOCAL
    };
  },
});
</script>
<style scoped lang="scss">
.con {
  width: 100%;
  height: 100%;
}

.cloud {
  margin: 22px 0 22px 24px;

  h3 {
    font-weight: bold;
    font-size: 24px;
    line-height: 100%;
    margin-bottom: 5px;
  }

}

.cloud-option {
  margin-top: 10px;
  position: relative;
  border: 2px solid rgba(151, 150, 150, 0.486);
  border-radius: 5px;
  margin-right: 16px;
  padding: 4px;

  &.selected {
    border-color: var(--accent-color); // blue
  }
}

.cloud-img {
  height: 80px;
  width: 80px;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  top: 5px;
  left: 5px;
  background-color: var(--accent-color); // blue
  color: white;
  border-radius: 50%;
  font-size: 12px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  z-index: 2;
}


.cloud-tab {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;

  .aws {
    height: 80px;
    width: 80px;
    cursor: pointer;
  }
}

._btn-submit {
  width: 158px;
  height: 45px;
  padding: 0px;
  font-size: 14px;
  font-weight: 500;
}

.data {
  &__window {
    width: 90%;
    height: 100%;
  }

  &__content-wrapper {
    margin: 31px auto;
    overflow: hidden;
    width: 98%;
    display: flex;
  }

  &__sidebar {
    display: flex;
    flex-direction: column;
  }

  &__body {
    position: relative;
    margin-left: 0;
    width: 100%;
    overflow: scroll;
    height: 100%;
    background-color: white;
    padding-bottom: 57px;
    //fixing blurred text
    -webkit-transform: translate3d(0, 0, 0) !important;
    transform: translate3d(0, 0, 0) !important;

    &__footer {
      display: flex;
      justify-content: space-between;
      width: 90%;
      margin-left: 76px;
      align-items: center;

      &_btn-submit {
        width: 158px;
        height: 45px;
      }

      &__btn {
        color: var(--accent-color);
        width: 158px;
        height: 45px;
        border: 1px solid var(--accent-color);
        border-radius: 5px;
        cursor: pointer;
        font-weight: 500;
        font-size: 14px;
        margin-right: 13px;
        transition: all 0.3s linear;

        &:hover {
          background-color: var(--accent-color);
          color: #fff;
          transition: all 0.3s linear;
        }
      }
    }

    &__title {
      font-weight: bold;
      font-size: 24px;
      line-height: 100%;
      margin: 22px 0 22px 24px;
    }

    &::-webkit-scrollbar {
      width: 10px;
      height: 18px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: var(--accent-color);
      border-radius: 31px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      // background: var(--accent-color);
      background: #555;

    }
  }

  &__creation {
    position: relative;

    &__line {
      margin: 20px 0 -20px 0;
      height: 100%;
      position: absolute;
      width: 1px;
      border-left: 1px dashed var(--accent-color);
      left: 40px;
      top: 0;
      z-index: 1;
    }

    &__item {
      display: flex;
      width: 100%;
      height: 90%;
      margin-left: 25px;
      margin-bottom: 17px;
      position: relative;

      &__hide-line {
        height: 100%;
        width: 30px;
        background-color: white;
        position: absolute;
        top: 27px;
        left: 0;
        z-index: 1;
      }

      >div {
        width: 90%;
      }

      &__numbers {
        position: relative;
        top: 20px;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        background: var(--accent-color);
        font-weight: 500;
        font-size: 14px;
        color: white;
        border-radius: 100%;
        margin-right: 21px;
      }
    }
  }
}

.advertisement {
  border: 1px dashed rgba(21, 44, 91, 0.42);
  border-radius: 10px;
  background-color: #e8eaed;
  width: 10%;
  height: 972px;
  margin-left: 23px;
  font-weight: 500;
  font-size: 14px;
  color: var(--blue-text-color);
  display: flex;
  align-items: center;

  >span {
    transform: rotate(90deg) translateY(-13px);
  }
}

.additional-settings {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 90%;
  margin-left: 76px;
  margin-bottom: 20px;

  &__checkbox {
    margin-left: 20px;
  }

  &__label {
    font-weight: bold;
    font-size: 15px;
    color: var(--ink-color);
  }
}

.warning-text {
  float: left;
  color: #e2c36b;
  font-size: 15px;
}

.tooltip {
  position: relative;
  display: inline-block;

  .tooltiptext {
    visibility: hidden;
    background-color: white;
    color: var(--blue-text-color);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
    text-align: center;
    padding: 10px;
    border-radius: 6px;
    font-family: 'Roboto', sans-serif;
    width: 200px;
    font-weight: bold;
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;

    &:after {
      content: '';
      position: absolute;
      top: 70%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 10px;
      border-style: solid;
      border-color: white transparent transparent transparent;
    }
  }

  &:hover .tooltiptext {
    visibility: visible;
  }
}
</style>
