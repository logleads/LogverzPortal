<template>
  <div class="container" @click.self="close">
    <div class="container__window">
      <div class="container__body">
        <h4>Are You Sure?</h4>
      </div>
      <div class="container__footer">
        <Button text="No" @click="close" />
        <Button text="Yes" @click="save" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';

import Button from '~/components/shared/button.vue';

export default defineComponent({
  name: 'ConfirmationDialog',
  components: {
    Button,
  },
  setup(props, { emit }) {
    const submitted: Ref<boolean> = ref(false);

    function close(shouldSync: boolean = false): void {
      emit('closeConfirmationPopup');
    }

    async function save(e: Event) {
      e.stopPropagation();

      emit('SaveConfirmationPopup');
    }
    return {
      save,
      close,
      submitted,
    };
  },
});
</script>

<style scoped lang="scss">
.container {
  width: 500%;
  height: 300%;
  top: 0%;
  left: 0%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 120000;

  &__window {
    width: 500px;
    height: 300px;
    position: relative;
    background-color: white;
    border-radius: 5px;
    top: 20%;
    left: 10%;
    transform: translate(-50%, -50%);
    z-index: 200000;
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
