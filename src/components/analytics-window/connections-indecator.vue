<template name="component-name">
  <div :class="$style['box']">
    <div :class="$style['indecator']" @click="openDropDown">
      <img
        v-if="isConnected"
        :src="require('~/assets/images/connected.svg')"
        alt="connected-vector"
      />
      <img v-else :src="require('~/assets/images/disconnected.svg')" alt="disconnected-vector" />
    </div>

    <div v-if="isOpenDropDown" :class="$style['drop-down']">
      <div :class="$style['drop-down__box']">
        <div v-if="loader" :class="$style['drop-down__loader']">
          <Loader accent />
        </div>
        <template v-if="!loader">
          <div :class="$style['drop-down__first-part']">
            <div :class="$style['drop-down__header']">
              <div :class="$style['drop-down__header__title']">
                <img
                  :src="require('~/assets/images/server-storage.svg')"
                  alt="connected-vector"
                /><span>Database(s) </span>
              </div>
              <Loader v-if="isLoaderForIndicatore" accent :size="25" />
            </div>
            <div
              v-for="(instanse, index) in DBinstanse"
              :key="index"
              :class="$style['drop-down__body']"
            >
              <span :class="$style['drop-down__body__center']">
                <span
                  :class="$style['drop-down__ind']"
                  :style="{ backgroundColor: instanse.status }"
                ></span>
                <p @click="() => openDbInstance(instanse.DBInstanceIdentifier)">
                  {{ instanse.name }}
                </p>
              </span>
              <button
                @click="
                  () =>
                    setProperty(instanse.status, instanse.DBInstanceIdentifier, instanse.cluster)
                "
              >
                {{ instanse.status == 'gray' ? 'start' : 'stop' }}
              </button>
            </div>
          </div>
          <div :class="$style['drop-down__tmp-part-ferst']">
            <div :class="$style['drop-down__counter']">
              <div :class="$style['drop-down__counter__left']">
                <img :src="require('~/assets/images/undo-arrow.svg')" alt="connected-vector" /><span
                  >TurnService</span
                >
              </div>
              <div :class="$style['drop-down__counter__self']">
                <div :class="$style['drop-down__counter__self__flex']">
                  <span title="Minimum size">M {{ turnServ[0].MinSize }}</span>
                  <span title="Maximum size">M {{ turnServ[0].MaxSize }}</span>
                  <span title="Desired capacity">D {{ turnServ[0].DesiredCapacity }}</span>
                  <div>
                    <div @click="() => operations('countTurnService', true)">+</div>
                    <div @click="() => operations('countTurnService', false)">-</div>
                  </div>
                </div>
                <Loader v-if="isLoaderForIndicatore" accent :size="25" />
              </div>
            </div>
            <div
              v-for="(i, index) in turnServInstances"
              :key="index"
              :class="$style['drop-down__bd']"
            >
              <span
                :class="$style['drop-down__ind']"
                :style="selectStatuseForAutoGroups(i.LifecycleState ? i.LifecycleState : '')"
              ></span>
              <p @click="() => open(i.InstanceId)">
                {{ i.InstanceId ? i.InstanceId : 'Turn instance' }}
              </p>
            </div>
          </div>
          <div :class="$style['drop-down__tmp-part']">
            <div :class="$style['drop-down__counter']">
              <div :class="$style['drop-down__counter__left']">
                <img :src="require('~/assets/images/server.svg')" alt="connected-vector" /><span
                  >WebRTCProxy</span
                >
              </div>
              <div :class="$style['drop-down__counter__self']">
                <div :class="$style['drop-down__counter__self__flex']">
                  <span title="Minimum size">M {{ proxy[0].MinSize }}</span>
                  <span title="Maximum size">M {{ proxy[0].MaxSize }}</span>
                  <span title="Desired capacity">D{{ proxy[0].DesiredCapacity }}</span>
                  <div>
                    <div @click="() => operations('countProxy', true)">+</div>
                    <div @click="() => operations('countProxy', false)">-</div>
                  </div>
                </div>
                <Loader v-if="isLoaderForIndicatore" accent :size="25" />
              </div>
            </div>
            <div v-for="(i, index) in proxyInstances" :key="index" :class="$style['drop-down__bd']">
              <span
                :class="$style['drop-down__ind']"
                :style="selectStatuseForAutoGroups(i.LifecycleState ? i.LifecycleState : '')"
              ></span>
              <p @click="() => open(i.InstanceId)">
                {{ i.InstanceId ? i.InstanceId : 'Proxy instanse' }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, Ref, ref } from '@vue/composition-api';

import Loader from '~/components/shared/loader.vue';
import { REGION } from '~/constants';
import { ConnectionIndecatoreModule } from '~/store/modules/connection-indecatore';
import { ServerConnectionModule } from '~/store/modules/server-connection';
import { AutoscalingGroupsName } from '~/types/models/autoscaling-group-name';

// @Component({
//   name: 'ConnectionsIndecator',
//   components: { Loader },
// })
export default defineComponent({
  name: 'ConnectionsIndecator',
  components: { Loader },
  setup() {
    const isOpenDropDown = ref(false);
    const countProxy: Ref<number> = ref(1);
    const countTurnService: Ref<number> = ref(1);
    const timerId: Ref<number> = ref(0);

    const isConnected: ComputedRef<boolean> = computed(() => {
      return ServerConnectionModule.isConnectedToWebRTC;
    });

    const isLoaderForIndicatore: ComputedRef<boolean> = computed(() => {
      return ConnectionIndecatoreModule.loaderForIndicator;
    });

    const proxy: ComputedRef<any> = computed(() => {
      return ConnectionIndecatoreModule.proxy;
    });

    const turnServ: ComputedRef<any> = computed(() => {
      return ConnectionIndecatoreModule.turnServ;
    });

    const DBinstanse: ComputedRef<any> = computed(() => {
      return ConnectionIndecatoreModule.DBinstanse;
    });

    const turnServInstances: ComputedRef<any> = computed(() => {
      return ConnectionIndecatoreModule.turnServInstances;
    });

    const proxyInstances: ComputedRef<any> = computed(() => {
      return ConnectionIndecatoreModule.proxyInstances;
    });

    const loader: ComputedRef<boolean> = computed(() => {
      return ConnectionIndecatoreModule.loader;
    });

    const autoscalingGroupsName: ComputedRef<AutoscalingGroupsName> = computed(() => {
      return ConnectionIndecatoreModule.autoscalingGroupsName;
    });

    function operations(type: string, operations: boolean): void {
      if (type == 'countProxy') {
        if ((proxyInstances.value as Array<unknown>).length < 0) return;
        ConnectionIndecatoreModule.setDesiredCapacity({
          value: operations
            ? (proxyInstances.value as Array<unknown>).length + 1
            : (proxyInstances.value as Array<unknown>).length - 1,
          autoScalingGroupName: autoscalingGroupsName.value.WebRTCProxyASG,
        });
      } else if (type == 'countTurnService') {
        if ((turnServInstances.value as Array<unknown>).length < 0) return;
        ConnectionIndecatoreModule.setDesiredCapacity({
          value: operations
            ? (turnServInstances.value as Array<unknown>).length + 1
            : (turnServInstances.value as Array<unknown>).length - 1,
          autoScalingGroupName: autoscalingGroupsName.value.TurnServerASG,
        });
      }
    }

    function selectStatuseForAutoGroups(vl: string): unknown {
      if (vl === 'InService') {
        return { backgroundColor: 'green' };
      } else if (vl === 'Terminated') {
        return { backgroundColor: 'gray' };
      } else {
        return { backgroundColor: '#fd6c35' };
      }
    }

    function setProperty(state: string, DBname: string, cluster: string): void {
      console.log('set property cluster', cluster);
      console.log('set property DB', DBname);
      if (state !== '#fd6c35') {
        ConnectionIndecatoreModule.setProperty({
          DBname,
          state: state == 'gray' ? true : false,
          cluster,
        });
      }
    }

    function open(value: string): void {
      window.open(
        `https://${REGION}.console.aws.amazon.com/ec2/v2/home?region=${REGION}#InstanceDetails:instanceId=${value}`,
      );
    }

    function openDbInstance(value: string): void {
      window.open(
        `https://ap-southeast-2.console.aws.amazon.com/rds/home?region=${REGION}#database:id=${value};is-cluster=false`,
      );
    }

    function getServerStatus(): void {
      ConnectionIndecatoreModule.getDescribeAutoScalingGroups();
      ConnectionIndecatoreModule.getRTCStatuse();
    }

    function openDropDown(): void {
      if (!isOpenDropDown.value) {
        ConnectionIndecatoreModule.setLoader(true);
        getServerStatus();
        timerId.value = setInterval(() => {
          getServerStatus();
          ConnectionIndecatoreModule.setLoaderForIndicator(true);
          setTimeout(() => {
            ConnectionIndecatoreModule.setLoaderForIndicator(false);
          }, 1000);
        }, 8000) as unknown as number;
      } else {
        clearInterval(timerId.value);
      }
      isOpenDropDown.value = !isOpenDropDown.value;
    }

    return {
      openDropDown,
      getServerStatus,
      openDbInstance,
      open,
      setProperty,
      selectStatuseForAutoGroups,
      operations,
      autoscalingGroupsName,
      loader,
      proxyInstances,
      turnServInstances,
      DBinstanse,
      turnServ,
      proxy,
      isLoaderForIndicatore,
      isConnected,
      timerId,
      countTurnService,
      countProxy,
      isOpenDropDown,
    };
  },
});
</script>

<style module lang="scss">
.indecator {
  height: 50px;
  width: 50px;
  border-radius: 50px;
  display: flex;
}

.drop-down {
  position: absolute;
  top: 50px;
  right: 0;
  background-color: #fff;
  box-shadow: 0 4px 24px rgb(0 0 0 / 5%);
  border: 1px solid rgba(181, 190, 203, 0.28);
  border-radius: 10px;

  width: 300px;
  z-index: 100;

  &__box {
    color: #1a1b20;
    padding: 15px;
    font-weight: 600;
    font-size: 12px;
    line-height: 1;
  }

  &__loader {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button {
    margin-left: 20px;
  }

  &__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;

    &__center {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    button {
      margin-right: 7px;
    }
  }

  &__bd {
    display: flex;
    justify-content: start;
    align-items: center;
    margin: 5px 0;
  }

  &__ind {
    margin: 0 20px;
    width: 20px;
    height: 20px;
    border-radius: 50px;
    background-color: green;
  }

  &__header {
    margin: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    border: 1px solid black;

    &__title {
      display: flex;
      justify-content: start;
      align-items: center;
      span {
        margin: 0 20px;
      }
    }
  }

  &__counter {
    margin: 5px 0;
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 5px;
    border: 1px solid black;

    span {
      margin: 0 10px;
      cursor: pointer;
    }

    &__self {
      display: flex;
      justify-content: end;
      align-items: center;
      width: 200px;

      &__flex {
        display: flex;
        justify-content: start;
        align-items: center;
        cursor: pointer;
      }
    }

    &__left {
      display: flex;
      justify-content: start;
      align-items: center;
    }
  }
}

.box {
  position: relative;
}
</style>
