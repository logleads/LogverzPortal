<template>
  <div :class="$style['container']">
    <h1 :class="$style['container__head1']">Select visible columns</h1>
    <h2 :class="$style['container__head2']">Event properties</h2>

    <template v-if="views === null">
      <h2 :class="$style['container__head2']">There is no fields</h2>
    </template>
    <template v-else>
      <div v-for="(view, index) in views" :key="index" :class="$style['rules']">
        <input
          type="radio"
          :value="index"
          :checked="index == type"
          @change="changeViewType($event, index)"
        />
        <p :class="$style['my-5']">{{ index }}</p>
      </div>
      <template v-if="type == 'Custom'">
        <div
          v-for="item in fields"
          :key="item + Math.random() * 1000"
          :class="$style['container__item']"
        >
          {{ item.label }}
          <label :class="$style['switch']">
            <input v-model="data[item.label]" type="checkbox" @change="changeCustomColumn" />
            <span :class="[$style['slider'], $style['round']]"></span>
          </label>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  onMounted,
  Ref,
  ref,
  watch,
} from '@vue/composition-api';

import { QueryBuilderModule } from '~/store/modules/query-builder';
import { SaveSettingModule } from '~/store/modules/save-setting';

export default defineComponent({
  name: 'QueryTableSettings',
  components: {},
  props: {
    curentKey: {
      type: Number,
      required: true,
    },
    defaultType: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const data: Ref<any> = ref({});
    const types: Ref<Record<string, string>> = ref({ Default: 'Default' });
    const type: Ref<string | any> = ref(props.defaultType);
    const deftype = ref(props.defaultType);
    onMounted(() => {
      type.value =
        QueryBuilderModule.dataForAllWindows[props.curentKey as number].selectedViewsName;
    });

    function changeCustomColumn(): void {
      QueryBuilderModule.setShowCollums(
        Object.keys(data.value).filter((key: string) => data.value[key]) as [string],
      );
    }

    function checkSelectedColums(key: string): boolean {
      return QueryBuilderModule.dataForAllWindows[props.curentKey as number].showCollums
        ? QueryBuilderModule.dataForAllWindows[props.curentKey as number].showCollums.includes(key)
        : false;
    }

    const fields: ComputedRef<any> = computed(() => {
      const fields = QueryBuilderModule.dataForAllWindows[props.curentKey as number]
        ? QueryBuilderModule.dataForAllWindows[props.curentKey as number].rules
        : null;

      fields.map((item: any) => {
        data.value[item.label] = checkSelectedColums(item.label);
      });
      return fields;
    });

    const views: ComputedRef<any> = computed(() => {
      const data = QueryBuilderModule.dataForAllWindows[props.curentKey as number]
        ? {
            ...QueryBuilderModule.dataForAllWindows[props.curentKey as number].views,
            'All colums': 'All colums',
            Custom: 'Custom',
          } || {}
        : {};
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      types.value = data;
      return data;
    });
    function changeViewType(e: any, data: any): void {
      const oldType = type.value;
      types.value[data] = data;
      type.value = data;
      SaveSettingModule.setViews({ val: type.value, key: props.curentKey });

      if (type.value == 'All colums') {
        const collums = fields.value.map((item: any) => item.label) as [string];
        QueryBuilderModule.setShowCollums(collums);
        QueryBuilderModule.setViewsName('All colums');
        return;
      } else if (type.value === 'Custom') {
        QueryBuilderModule.setViewsName('Custom');
        if (oldType == 'All colums') {
          const collums = fields.value.map((item: any) => item.label) as [string];
          QueryBuilderModule.setShowCollums(collums);
        }
        QueryBuilderModule.setShowCollums(views.value[oldType]);
      } else {
        if (views.value) {
          QueryBuilderModule.setViews(type.value);
          QueryBuilderModule.setShowCollums(views.value[type.value]);
        }
      }
    }

    watch(deftype, (v: string) => {
      type.value = v;
    });
    return {
      changeViewType,
      views,
      fields,
      checkSelectedColums,
      changeCustomColumn,
      data,
      types,
      type,
    };
  },
});
</script>

<style module lang="scss">
.rules {
  display: flex;
  justify-content: start;
  align-items: center;
}

.container {
  position: absolute;
  bottom: -600px;
  left: -300px;
  z-index: 2;
  background-color: white;
  width: 300px;
  height: 600px;
  overflow: scroll;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);

  &::-webkit-scrollbar {
    width: 5px;
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

  &__head1 {
    font-weight: 500;
    font-size: 16px;
    color: var(--blue-text-color);
    margin: 10px 0;
  }

  &__head2 {
    font-weight: 500;
    font-size: 14px;
    color: var(--blue-text-color);
    margin: 10px 0;
  }

  &__item {
    border-top: 1px solid var(--secondary-text-color);
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:last-child {
      border-bottom: 1px solid var(--secondary-text-color);
    }
  }
}

.switch {
  position: relative;
  display: inline-block;
  width: 35px;
  height: 20px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 15px;
  width: 15px;
  left: 2.5px;
  bottom: 2.5px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(15px);
  -ms-transform: translateX(15px);
  transform: translateX(15px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.my-5 {
  margin: 5px 0 5px 0;
}
</style>
