<template>
  <div :class="$style['container']">
    <div :class="$style['management']">
      <fieldset :class="$style['management__fieldset']">
        <legend>Identity Management</legend>
        <div :class="$style['button-container']">
          <Button text="Start" :disabled="isFetching" @click="handleSubmit" />
        </div>
        <h1 :class="[$style['management__footer'], $style['tooltip']]">
          Last identity Sync(UTC time): {{ lastSyncTime.utcTime || '...' }}
          <span :class="[$style['management__footer'], $style['tooltip_tooltiptext']]"
            >Last identity Sync(Local time):{{ lastSyncTime.localTime || '...' }}</span
          >
        </h1>
      </fieldset>
      <!--
      <fieldset :class="$style['management__fieldset']">
        <legend>PlaceHolder</legend>
      </fieldset>
      <fieldset :class="$style['management__fieldset']">
        <legend>PlaceHolder</legend>
      </fieldset>
      <fieldset :class="$style['management__fieldset']">
        <legend>PlaceHolder</legend>
      </fieldset>
      -->
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted } from 'vue';

import Button from '~/components/shared/button.vue';
import { AdminModule } from '~/store/modules/admin';

export default defineComponent({
  name: 'PlatformTable',
  components: {
    Button,
  },
  setup() {
    onMounted(async () => {
      await AdminModule.getLastSyncTime();
      await AdminModule.getGroups();
      await AdminModule.getPolicies();
    });
    const isFetching: ComputedRef<boolean> = computed(() => {
      return AdminModule.identitySyncFetching;
    });

    async function handleSubmit(): Promise<void> {
      await AdminModule.startIdentitySync();
      await AdminModule.getLastSyncTime();
    }

    const lastSyncTime: ComputedRef<{ utcTime?: string; localTime?: string }> = computed(() => {
      return AdminModule.lastSyncTime;
    });

    function syncTime(): void {
      AdminModule.getLastSyncTime();
    }
    return {
      syncTime,
      lastSyncTime,
      handleSubmit,
      isFetching,
    };
  },
});
</script>

<style module lang="scss">
.button-container {
  display: flex;
  justify-content: flex-end;
  height: 100%;
  align-items: center;
}

.container {
  padding: 0 15px;
}

.management {
  &__fieldset {
    margin-top: 20px;
    width: 100%;
    height: 200px;
    position: relative;
    legend {
      margin: 0 auto;
    }
  }

  &__footer {
    position: absolute;
    font-size: 15px;

    bottom: 10px;
    left: 50%;
    transform: translate(-50%, 0);
  }
}

.tooltip {
  position: relative;
  display: inline-block;
  z-index: 100;

  &_tooltiptext {
    visibility: hidden;
    width: 320px;
    background-color: #1a1b20;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;

    /* Position the tooltip */
    position: absolute;
    bottom: -30px;
    right: 0px;
    z-index: 1;
  }
}

.tooltip:hover .tooltip_tooltiptext {
  visibility: visible;
}
</style>
