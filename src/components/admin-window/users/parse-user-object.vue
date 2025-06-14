<template>
  <div>
    <div v-if="typeof obj === 'object' && !Array.isArray(obj)">
      <template v-for="s in Object.keys(obj)" :key="s + Math.random() * 10000">
        <parse-user-object :obj="obj[s]" :label="s" />
      </template>
    </div>
    <div v-if="Array.isArray(obj)" class="container">
      <span v-if="obj.length" class="container__key">{{ changeKey(label) }}:</span>
      <template v-if="obj.length">
        <span
          v-for="(item, index) in obj"
          :key="index + Math.random() * 10000"
          class="container__value"
        >
          <template v-if="checkIfObj(item)">
            <div class="container__child">
              <parse-user-object
                v-for="(ir, nr) in JSON.parse(item)"
                :key="nr + Math.random() * 10000"
                :obj="ir"
                :label="nr"
              />
            </div>
          </template>
          <template v-else>
            <pre>{{ item }}</pre>
            {{ obj.length - 1 !== index ? '' : '' }}
          </template>
        </span>
      </template>
    </div>
    <div v-if="typeof obj === 'string' && label !== 'PolicyDocument'" class="container">
      <span class="container__key">{{ label }}:</span>
      <span class="container__value-string">{{ obj }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { checkIsStringIsObj } from '~/utils/checkIsStringIsObj';
import { labelFromKey } from '~/utils/pipes';

export default defineComponent({
  name: 'ParseUserObject',
  components: {},
  props: {
    obj: {
      type: Object,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
  },

  // @Prop({ required: false }) readonly obj!: Record<string, never> | string;
  // @Prop({ required: false }) readonly label!: string;
  setup() {
    function changeKey(value: string): string {
      return labelFromKey(value);
    }

    function checkIfObj(value: string): boolean {
      return checkIsStringIsObj(value);
    }
    return {
      changeKey,
      checkIfObj,
    };
  },
});
</script>

<style scoped lang="scss">
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

  &__value-string {
    display: block;
    word-wrap: break-word;
    width: 100%;
    white-space: normal;
  }

  &__child {
    margin-left: 20px;
    margin-top: 10px;
    padding-left: 15px;
    border: 1px solid var(--accent-color);
    padding-right: 10px;
  }
}
</style>
