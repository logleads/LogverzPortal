<template>
  <vue-pdf-app :pdf="urlData"></vue-pdf-app>
</template>
<script lang="ts">
import { computed, ComputedRef, defineComponent } from 'vue';
import VuePdfApp from 'vue3-pdf-app';

// import VuePdfApp from 'vue-pdf-app';
import { UserModule } from '~/store/modules/user';

export default defineComponent({
  name: 'TermsWindow',
  components: {
    VuePdfApp,
  },
  setup() {
    // const url: Ref<string> = ref(
    //   'https://docs.logverz.io/assets/docs/Logverz_Software_Public_Licence_Agreement.pdf',
    // );
    const urlData: ComputedRef<string> = computed(() => {
      return UserModule.pdfURL;
    });
    return {
      urlData,
    };
  },
});
</script>
<style module lang="scss">
.hiden {
  opacity: 0;
}
.window-name {
  // width: 320px;
  padding: 10px;
}

.window-name-p {
  padding: 5px;
}
.container {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  overflow: hidden;
  position: absolute;
  top: 50px;
}

.inactive-overlay {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.4);
  z-index: 21;

  &--on {
    display: block;
  }
}

.top-panel {
  background-color: var(--header-color);
  height: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1px;

  &__label {
    font-weight: 500;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__label:hover {
    border: 1px solid white;
    border-radius: 6px;
    // cursor: pointer;
    // cursor: auto;
    cursor: text;
  }

  &__controls {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 20px;
    align-items: center;
    padding-right: 10px;
  }

  &__control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 15px;
    color: #fff;
    cursor: pointer;
  }
}

.resize-side {
  position: absolute;
  z-index: 20;

  &--left,
  &--right {
    top: 10px;
    bottom: 10px;
    width: 3px;
    cursor: ew-resize;
  }

  &--left,
  &--lt,
  &--lb {
    left: 0;
  }

  &--right,
  &--rt,
  &--rb {
    right: 0;
  }

  &--top,
  &--bottom {
    left: 10px;
    right: 10px;
    height: 3px;
    cursor: ns-resize;
  }

  &--top,
  &--lt,
  &--rt {
    top: 0;
  }

  &--bottom,
  &--lb,
  &--rb {
    bottom: 0;
  }

  &--lt,
  &--lb,
  &--rt,
  &--rb {
    width: 10px;
    height: 10px;
  }

  &--rt,
  &--lb {
    cursor: nesw-resize;
  }

  &--lt,
  &--rb {
    cursor: nwse-resize;
  }

  &--off {
    cursor: auto;
  }
}

.content {
  background-color: #fff;
  height: 100%;
}

.btn {
  background-color: white;
  color: var(--accent-color);
  width: 140px;
  height: 45px;
  border: 1px solid var(--accent-color);
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s linear;

  &:hover {
    background-color: var(--accent-color);
    color: #fff;
    transition: all 0.3s linear;
  }
}

.winsowNameFields {
  display: flex;
}
</style>
