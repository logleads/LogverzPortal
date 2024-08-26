<template>
  <div>
    <h1>Policies</h1>
    <!-- <div>{{plainItems}}</div> -->
    <template v-for="(item, key) in Object.keys(data?.data)" :key="key">
      <div>
        <div v-if="typeof data?.data[item] === 'object' && !Array.isArray(data.data[item])"
          :key="item + Math.random() * 10000">
          <template v-for="(k, i) in data?.data[item]" :key="i + Math.random() * 10000">
            <template v-if="typeof k === 'object'">
              <ParseUserObject :obj="k" :label="i" />
            </template>
            <template v-else>
              <div v-if="k !== ''" :class="$style['container']">
                <template v-if="i === 'UserInline'">
                  <span :class="$style['container__key-clickable']" @click="handleShowMore">{{ i }}:
                  </span>
                  <span :class="$style['container__value']"> {{ k }}</span>
                  <div v-if="showMoreInline">
                    <div>
                      <span :class="$style['container__key']">Policy name: </span>
                      <span :class="$style['container__value']">{{
                        filterPlainItems(plainItems, data?.data.Name).PolicyName
                      }}</span>
                    </div>
                    <div>
                      <span :class="$style['container__key']">Policy document: </span>

                      <json-viewer :value="formaterPolicyDocument(plainItems, data.data.Name)" :expand-depth="50"
                        copyable boxed expanded="true" sort></json-viewer>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <span :class="$style['container__key']">{{ i }}: </span>
                  <span :class="$style['container__value']">{{ k }}</span>
                </template>
              </div>
            </template>
          </template>
        </div>
        <div v-if="Array.isArray(data?.data[item])" :key="item + Math.random() * 10000">
          <div :class="$style['container']">
            <span :class="$style['container__key']">{{ item }}: </span>
            <span v-for="(arrItem, index) in data.data[item]" :key="arrItem + Math.random() * 10000"
              :class="$style['container__value']">{{ arrItem }}{{ data.data[item].length - 1 !== index ? ',' : ''
              }}</span>
          </div>
        </div>
        <div v-if="data?.data[item] === 'null'" :key="item + Math.random() * 10000">
          <div :class="$style['container']">
            <span :class="$style['container__key']">{{ item }}: </span>
            <span :class="$style['container__value']">{{ data.data[item] }}</span>
          </div>
        </div>
      </div>
    </template>
    <div :class="$style['container-flex']">
      <h1>Groups</h1>
      <div :class="$style['container__value']">
        <p v-for="(item, key) in data?.data.IAMGroups.split(',')" :key="key">{{ item }}</p>
      </div>
    </div>
    <div :class="$style['container']">
      <span :class="$style['container__key']">JSON view: </span>
      <json-viewer :value="data?.data" :expand-depth="5" copyable boxed sort></json-viewer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';

import ParseUserObject from '~/components/admin-window/users/parse-user-object.vue';
import { userResponse } from '~/types/models/admin-window-types';
type userResponseType = keyof userResponse;

export default defineComponent({
  name: 'MasterDetailedUsers',
  components: { ParseUserObject },
  props: {
    data: {
      type: Object,
      required: false,
    },
    plainItems: {
      type: Array || null,
      required: false,
    },

  },



  // @Prop({ required: false, type: Object }) readonly data!: Record<string, unknown>;
  // @Prop({ required: false, type: Array }) readonly plainItems!: userResponse[];
  setup(props) {
    const showMoreInline: Ref<boolean> = ref(false);

    function filterPlainItems(
      data: userResponse[],
      name: userResponseType,
    ): {
      PolicyDocument: string;
      PolicyName: string;
    } {
      return JSON.parse(
        data.filter((item: any) => item.Name === name).map(it => it.Policies.UserInline)[0][0],
      );
    }

    function formaterPolicyDocument(data: userResponse[], name: userResponseType): JSON {
      const fr = filterPlainItems(data, name)
        .PolicyDocument.replaceAll('"', '')
        .replaceAll("'", '"');
      return JSON.parse(fr);
    }

    function handleShowMore(): void {
      showMoreInline.value = !showMoreInline.value;
    }
    return {
      handleShowMore,
      formaterPolicyDocument,
      filterPlainItems,
      showMoreInline,
    };
  },

});

</script>

<style module lang="scss">
@import '../styles';

.container {
  margin: 15px 0;

  &__key {
    font-size: 14px;
    color: var(--accent-color);
  }

  &__key-clickable {
    font-size: 14px;
    color: var(--accent-color);
    font-weight: bold;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  &__value {
    font-size: 13px;
    color: #000000;
  }
}

.document {
  margin-top: 10px;
  font-size: 13px;
  color: #000000;
  display: block;
  word-wrap: break-word;
  width: 100%;
  white-space: normal;
}
</style>
