<template>
  <div class="setting-window">
    <h3 class="heading-padding">Connectivity:</h3>
    <div class="additional-settings">
      <input
        id="withRedirect"
        v-model="useTurnServer"
        class="additional-settings__checkbox"
        type="checkbox"
      />
      <p class="additional-settings__label">Use Turn/Stun server</p>
      <span class="span-margin">
        <ToolTip :tip="rtcDescription" />
      </span>
    </div>
    <div class="server-color">
      <h4>Servers</h4>
      <ol v-for="server in serverDetails" :key="server.urls">
        <li>{{ server.urls }}</li>
      </ol>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, ComputedRef, defineComponent, Ref, ref, watch } from 'vue';

import ToolTip from '~/components/shared/tool-tip.vue';
import { USR_RTC_DESCRIPTION } from '~/constants';
import { ServerConnectionModule } from '~/store/modules/server-connection';
import { UserModule } from '~/store/modules/user';
import { WindowData, WindowName } from '~/store/modules/windows';

export default defineComponent({
  name: 'UserSettings',
  components: { ToolTip },
  setup() {
    const window: Ref<WindowData> = ref({
      minimized: false,
      label: 'User Settings',
      name: 'UserSettings' as WindowName,
      zIndex: 9999,
      index: 1,
      windowName: 'user-settings',
      dataNumber: Math.floor(Math.random() * 1000),
    });
    const localTurnServer: Ref<boolean> = ref(true);
    const rtcDescription = ref(USR_RTC_DESCRIPTION);

    const serverDetails: ComputedRef = computed(() => {
      let data = ServerConnectionModule.serverDetails;
      console.log('ICEServers', data);
      if (data.iceServers) {
        return data.iceServers;
      } else {
        return [];
      }
    });
    const useTurnServer = computed({
      get() {
        return JSON.parse(UserModule.useTurnServer);
      },
      set(value: any) {
        UserModule.turnServerValue(value);
      },
    });
    watch(useTurnServer, (value: any) => {
      localTurnServer.value = value;
    });
    return {
      useTurnServer,
      serverDetails,
      rtcDescription,
      localTurnServer,
      window,
    };
  },
});
</script>
<style  scoped lang="scss">
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

.additional-settings {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 90%;
  margin-bottom: 20px;

  &__checkbox {
    margin-right: 10px;
    transform: scale(1.5);
  }

  &__label {
    font-weight: 500;
    font-size: 15px;
    color: var(--ink-color);
  }
}
.setting-window {
  font-size: 24px;
  padding: 25px;
  width: 100%;
  height: 200px;
}
.heading-padding {
  padding-bottom: 20px;
}
.winsowNameFields {
  display: flex;
}
li {
  font-size: 16px;
  margin-left: 16px;
}
h4 {
  margin-bottom: 4px;
}
.server-color {
  color: gray;
}
.span-margin {
  margin-left: 5px;
}
</style>
