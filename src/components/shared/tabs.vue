<template>
  <div>
    <div :class="$style['table__header__buttons']">
      <b v-if="textBeforeBtn !== ''" :class="$style['before-btn-text']"> {{ textBeforeBtn }} </b>
      <button
        :class="[
          $style['table__header__buttons__btn'],
          $style['border-radius-left'],
          { [$style['active']]: tableContent },
        ]"
        @click="chackBtn(true)"
      >
        {{ btnLeftText }}
      </button>
      <button
        :class="[
          $style['table__header__buttons__btn'],
          $style['border-radius-right'],
          { [$style['active']]: !tableContent },
        ]"
        @click="chackBtn(false)"
      >
        {{ btnRigthText }}
      </button>
      <b v-if="textAfterBtn !== ''" :class="$style['btn-text']"> {{ textAfterBtn }} </b>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Tabs',
  props: {
    btnLeftText: {
      type: String,
      required: true,
    },
    btnRigthText: {
      type: String,
      required: true,
    },
    stateBTN: {
      type: Boolean,
      required: true,
    },
    textAfterBtn: {
      type: String,
      required: false,
    },
    textBeforeBtn: {
      type: String,
      required: false,
    },
  },
  setup(props, { emit }) {
    const tableContent: Ref<boolean> = ref(props.stateBTN);
    function chackBtn(v: boolean): void {
      tableContent.value = v;
      changeTableContent(v);
    }
    function changeTableContent(v: boolean): boolean {
      emit('change-table-content', v);
      return v;
    }
    return {
      tableContent,
      chackBtn,
      changeTableContent,
    };
  },
});
</script>

<style module lang="scss">
.table {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin: 15px 0;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // background-color: white;
    height: 73px;
    padding-left: 24.5px;
    font-weight: 500;
    font-size: 14px;
    color: var(--blue-text-color);

    > div {
      display: flex;
      align-items: center;
      padding-right: 19px;
    }

    &__buttons {
      padding: 0 4px;
      display: flex;
      align-items: center;
      margin-right: 18px;
      width: 133px;
      height: 30px;
      // background-color: rgba(136, 196, 190, 0.1);
      // border-radius: 5px;

      &__btn {
        width: 111px;
        height: 27px;
        font-weight: 500;
        font-size: 12px;
        color: #242222;
        background-color: #ffffff;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.03);

        &.active {
          background-color: #88c4be;
          font-weight: 500;
          font-size: 12px;
          color: white;
          box-shadow: none;
        }
      }
    }
  }
}

.border-radius-right {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.border-radius-left {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.btn-text {
  margin-left: 5px;
}
.before-btn-text {
  // margin-left: 5px;
  font-size: 14px;
  padding-left: 4px;
  padding-right: 10px;
}
.table__header__buttons__btn {
  border: 1px solid rgba(43, 42, 44, 0.4);
  padding-right: 1px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
// .table__header__buttons{
//   margin-right: 5px;
// }
</style>
