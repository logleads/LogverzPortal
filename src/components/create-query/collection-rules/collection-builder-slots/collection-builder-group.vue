<template>
  <div :class="['group', `group-depth-${depth.toString()}`]">
    <div class="group-container">
      <div class="group-header">
        <div class="group-header__buttons-container">
          <button
            v-for="label in labels.matchTypes"
            :key="label.id"
            :class="[
              { ['query-item__btn']: query.logicalOperator !== label.id },
              { ['query-item__btn-disabled']: query.logicalOperator === label.id },
              { ['disabled']: isCustomRules },
            ]"
            :disabled="isCustomRules"
            @click="handleClick(label.id)"
          >
            <span> {{ label.label }} </span>
          </button>
        </div>
        <div
          ref="select"
          class="group-header__icons-container"
          contenteditable="true"
          @blur="handleBlur"
        >
          <div
            contenteditable="false"
            :class="['query-item__icon', { 'disabled': isCustomRules }]"
          >
            <div contenteditable="false" @click="togglePopup">
              <Icon name="plus" :height="30" :width="30" />
            </div>
            <div
              v-if="isPopupShown"
              contenteditable="false"
              class="query-item__icon__add"
            >
              <div v-if="depth < maxDepth" contenteditable="false" @click="handleAddGroup">
                <span contenteditable="false" class="query-item__icon__add__plus">
                  <Icon name="simple-plus" :width="15" :height="15" />
                </span>
                <span contenteditable="false">{{ labels.addGroup }}</span>
              </div>
              <div contenteditable="false" @click="handleAddRule">
                <span contenteditable="false" class="query-item__icon__add__plus">
                  <Icon name="simple-plus" :width="15" :height="15" />
                </span>
                <span contenteditable="false"> {{ labels.addRule }}</span>
              </div>
            </div>
          </div>
          <div
            v-if="depth > 1"
            contenteditable="false"
            class="close-icon"
            @click="removeGroup"
          >
            <Icon name="x-mark" :width="30" :height="30" />
          </div>
        </div>
      </div>
      <div class="input-container">
        <div class="input-container__item">
          <SelectObjectItem
            :items="rules"
            :selected-rule="selectedRule"
            :disabled="isCustomRules"
            @select="selectRule"
          />
        </div>
      </div>
    </div>

    <div>
      <query-builder-children v-bind="$props" :is-custom-rules="isCustomRules" />
    </div>
  </div>
</template>

<script>
import QueryBuilderGroup from 'vue-query-builder/dist/group/QueryBuilderGroup.umd.js';

import QueryBuilderRule from '~/components/create-query/collection-rules/collection-builder-slots/collection-builder-rule.vue';
import SelectObjectItem from '~/components/create-query/collection-rules/collection-builder-slots/collection-select-object.vue';
import Icon from '~/components/shared/icon.vue';

export default {
  name: 'QueryBuilderGroup',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    QueryBuilderRule,
    Icon,
    SelectObjectItem,
  },
  extends: QueryBuilderGroup,
  // eslint-disable-next-line vue/require-prop-types
  props: ['isCustomRules'],
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  data() {
    return {
      isPopupShown: false,
    };
  },
  watch: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    isPopupShown(val) {
      if (val) {
        this.$refs.select.focus();
      } else {
        this.$refs.select.blur();
      }
    },
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handleClick(value) {
      this.query.logicalOperator = value;
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    togglePopup() {
      if (!this.isCustomRules) {
        this.isPopupShown = !this.isPopupShown;
      }
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handleBlur() {
      this.isPopupShown = false;
    },

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    removeGroup() {
      if (!this.isCustomRules) {
        this.remove();
      }
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    selectRule(rule) {
      this.selectedRule = rule;
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handleAddGroup() {
      this.addGroup();
      this.togglePopup();
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handleAddRule() {
      this.addRule();
      this.togglePopup();
    },
  },
};
</script>

<style scoped lang="scss">
.group {
  width: 100%;
}

.group-header {
  display: flex;
  width: 100%;

  &__buttons-container {
    width: 123px;
    display: flex;
    justify-content: space-between;
  }

  &__icons-container {
    margin-left: 15px;
    display: flex;
    width: 66px;
    justify-content: space-between;
  }
}
.query-item {
  &__container {
    width: 265px;
  }

  &__header {
    display: flex;
    justify-content: space-between;

    &__buttons {
      width: 123px;
      display: flex;
      justify-content: space-between;
    }
  }

  &__btn {
    text-transform: uppercase;
    color: var(--accent-color);
    width: 58px;
    height: 30px;
    border: 1px solid var(--accent-color);
    border-radius: 5px;
    cursor: pointer;
  }

  &__btn-disabled {
    background-color: rgba(136, 196, 190, 0.1);
    border-radius: 5px;
    width: 58px;
    height: 30px;

    > span {
      opacity: 0.6;
      color: var(--accent-color);
      text-transform: uppercase;
    }
  }

  &__icon-container {
    display: flex;
    width: 66px;
    justify-content: space-between;
  }

  &__icon {
    position: relative;
    display: inline-block;
    cursor: pointer;

    &__add {
      position: absolute;
      top: 100%;
      right: 0;
      width: 137px;
      background-color: white;
      z-index: 1;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

      &__plus {
        margin-right: 10px;
      }

      > div {
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;
      }

      > div:hover {
        background: #bcbbbb;
      }
    }
  }

  &__input {
    font-weight: 500;
    font-size: 12px;
    line-height: 1;
    width: 265px;
    height: 44px;
    padding-left: 18px;
    margin: 12px 0;
    border-radius: 5px;
    border: 1px solid rgba(159, 166, 177, 0.22);

    &__drop-down {
      max-width: 265px;
      position: relative;

      & input {
        @extend .query-item__input;
      }

      &:before {
        content: '';
        width: 1px;
        height: 21px;
        background-color: rgba(159, 166, 177, 1);
        position: absolute;
        top: 35%;
        right: 32.5px;
      }
    }
  }

  &__arrow-down {
    position: absolute;
    top: 48%;
    right: 13px;
  }
}

.input-container {
  display: flex;
  width: 100%;
  &__item {
    width: 30%;
  }
}

.close-icon {
  cursor: pointer;
}

.group-container {
  margin-top: 23px;
  margin-bottom: 13px;
  background-color: var(--gray-background);
  border-radius: 5px;
  padding: 21.5px 30px 25.5px 30px;
}

.disabled {
  cursor: auto;
}

.group-depth-1 {
  border-left: 2px solid #8bc34a;
}

.group-depth-2 {
  margin-left: 10px;
  border-left: 2px solid #00bcd4;
}

.group-depth-3 {
  margin-left: 10px;
  border-left: 2px solid #ff5722;
}
</style>
