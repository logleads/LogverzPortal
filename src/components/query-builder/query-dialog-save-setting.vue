<template>
  <div v-if="isOpenDialogWindow" :class="[$style['container']]" @click.self="close">
    <div :class="[$style['container__window']]">
      <div :class="[$style['container__body']]">
        <div v-for="(item, key) in dataT" :key="key" :class="[$style['container__input']]">
          <label>{{ key }}</label>
          <Input :value="transformValue(item)" disabled />
        </div>
        <div :class="[$style['container__input']]">
          <label>Analysis name</label>
          <Input slot="input" v-model="Name" name="name" :placeholder="'Analysis name'" />
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
import { computed, ComputedRef, defineComponent, Ref, ref } from 'vue';

import Button from '~/components/shared/button.vue';
import Input from '~/components/shared/input.vue';
import { SaveSettingModule } from '~/store/modules/save-setting';

export default defineComponent({
  name: 'QueryItem',
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Button,
    // eslint-disable-next-line vue/no-reserved-component-names
    Input,
  },
  props: {
    curentKey: {
      type: Number,
      required: true,
    },
    dataNumber: {
      type: Number,
      required: true,
    },
  },
  // @Prop({ type: Number }) readonly curentKey!: number;
  setup(props) {
    const Name: Ref<string> = ref('');

    const isOpenDialogWindow: ComputedRef<boolean> = computed(() => {
      return SaveSettingModule.isOpenDialogWindow;
    });

    const dataT = computed(() => {
      return {
        DataBaseName: SaveSettingModule.dataT[props.dataNumber].DataBaseName,
        DatasetName: SaveSettingModule.dataT[props.dataNumber].TableName,
        DataType: SaveSettingModule.dataT[props.dataNumber].DataType,
      };
    });

    function close(): void {
      SaveSettingModule.closeDialogWindow();
    }

    function save(): void {
      SaveSettingModule.saveSetting({ key: props.dataNumber, name: Name.value });
      close();
    }

    function transformValue(obj: any): void {
      return Array.isArray(obj)
        ? obj.map(item => JSON.stringify(item)).join(' ')
        : typeof obj === 'object'
        ? JSON.stringify(obj)
        : obj;
    }
    return {
      transformValue,
      save,
      close,
      dataT,
      isOpenDialogWindow,
      Name,
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
</style>
