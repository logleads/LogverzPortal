<template>
  <div :class="[$style['group'], $style[`group-depth-${depth.toString()}`]]">
    <div>
      <div :class="$style['group-header']">
        <div :class="$style['group-header__buttons-container']">
          <button
            v-for="label in labels.matchTypes"
            :key="label.id"
            :class="[
              { [$style['query-item__btn']]: query.logicalOperator !== label.id },
              { [$style['query-item__btn-disabled']]: query.logicalOperator === label.id },
            ]"
            @click="handleClick(label.id)"
          >
            <span> {{ label.label }} </span>
          </button>
        </div>
        <div
          ref="select"
          :class="$style['group-header__icons-container']"
          contenteditable="true"
          @blur="handleBlur"
        >
          <div contenteditable="false" :class="$style['query-item__icon']">
            <div contenteditable="false" @click="togglePopup">
              <Icon name="plus" :height="30" :width="30" />
            </div>
            <div
              v-show="isPopupShown"
              contenteditable="false"
              :class="$style['query-item__icon__add']"
            >
              <!-- <div v-if="depth < maxDepth" contenteditable="false" @click="handleAddGroup">
                <span contenteditable="false" :class="$style['query-item__icon__add__plus']">
                  <Icon name="simple-plus" :width="15" :height="15" />
                </span>
                <span contenteditable="false">{{ labels.addGroup }}</span>
              </div> -->
              <div contenteditable="false" @click="handleAddRule">
                <span contenteditable="false" :class="$style['query-item__icon__add__plus']">
                  <Icon name="simple-plus" :width="15" :height="15" />
                </span>
                <span> {{ labels.addRule }}</span>
              </div>
            </div>
          </div>
          <div v-if="depth > 1" :class="$style['query-item__icon__remove']" @click="remove">
            <Icon name="x-mark" :width="30" :height="30" />
          </div>
        </div>
      </div>
      <div>
        <div>
          <SelectObjectItem
            :items="rules"
            :selected-rule="selectedRule"
            :expanded="selected"
            @expand="handleExpand"
            @select="selectRule"
          />
        </div>
      </div>
    </div>
    <!-- {{log($props, )}} -->
    <div>
      <query-builder-children v-bind="$props" />
    </div>
  </div>
</template>

<script>
import QueryBuilderGroup from 'vue-query-builder/dist/group/QueryBuilderGroup.umd.js';

import QueryBuilderRule from '~/components/query-builder/query-slots/query-builder-rule.vue';
import SelectObjectItem from '~/components/query-builder/query-slots/select-object-item.vue';
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
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  data() {
    return {
      isPopupShown: false,
      selected: false,
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
    handleExpand() {
      this.selected = !this.selected;
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    togglePopup() {
      this.isPopupShown = !this.isPopupShown;
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
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handleBlur() {
      this.isPopupShown = false;
    },

    log(v) {
      // eslint-disable-next-line no-console
      console.log(v);
    },
  },
};
</script>

<style module lang="scss">
.group {
  width: 100%;
}

.group-header {
  display: flex;
  width: 100%;
  justify-content: space-between;

  &__buttons-container {
    width: 123px;
    display: flex;
    justify-content: space-between;
  }

  &__icons-container {
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

    &__remove {
      cursor: pointer;
    }

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

.group-depth-1 {
  border-left: 2px solid #8bc34a;
  padding-left: 4px;
}

.group-depth-2 {
  margin-left: 8px;
  border-left: 2px solid #00bcd4;
  padding-left: 4px;
}

.group-depth-3 {
  margin-left: 8px;
  padding-left: 4px;
  border-left: 2px solid #ff5722;
}
</style>
