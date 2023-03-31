<template>
  <div>
    <template v-for="item in Object.keys(data?.data)">
      <div
        v-if="typeof data?.data[item] === 'object' && !Array.isArray(data.data[item])"
        :key="item + Math.random() * 10000"
      >
        <div v-for="(k, i) in data.data[item]" :key="i + Math.random() * 10000">
          <template v-if="typeof k === 'object'">
            <ParseObject :obj="k" :label="i" />
          </template>
          <template v-else>
            <div v-if="k !== ''" :class="$style['container']">
              <span :class="$style['container__key']">{{ i }}: </span>
              <div :class="$style['container__value']">{{ k }}</div>
            </div>
          </template>
        </div>
      </div>
      <div v-if="Array.isArray(data?.data[item])" :key="item + Math.random() * 10000">
        <div :class="$style['container']">
          <span :class="$style['container__key']">{{ item }}: </span>
          <div
            v-for="(arrItem, index) in data?.data[item]"
            :key="arrItem + Math.random() * 10000"
            :class="$style['container__value']"
          >
            {{ arrItem }}{{ data?.data[item].length - 1 !== index ? ',' : '' }}
          </div>
        </div>
      </div>
      <div v-if="data?.data[item] === 'null'" :key="item + Math.random() * 10000">
        <div :class="$style['container']">
          <span :class="$style['container__key']">{{ item }}: </span>
          <div :class="$style['container__value']">{{ data.data[item] }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';

import ParseObject from '~/components/shared/parseObject.vue';

export default defineComponent({
  name: 'MasterDetailed',
  components: { ParseObject },
  props: {
    data: {
      type: Object,
      required: false,
    },
  },
  setup(props) {
    // @Prop({ required: false, type: Object }) readonly data!: Record<string, any>;
    onMounted(() => {
      console.log(props.data);
    });
  },
});
</script>

<style module lang="scss">
@import './styles';

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
