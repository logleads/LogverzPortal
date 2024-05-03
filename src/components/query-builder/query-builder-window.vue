<template>
  <div
    ref="blockHeigth"
    :class="$style['analytics__content']"
    @mousemove="move"
    @mouseup="
      () => {
        isPassMoveBar = false;
        isSidebarMove = false;
      }
    "
  >
    <template v-if="isConnection">
      <p :class="$style['connection-message']">
        <Loader accent />
        <span :class="$style['connection-message__text']"> Initiating WebRTC connection </span>
      </p>
    </template>
    <template v-if="!isConnection && !isConnectedToWebRTC">
      <div :class="$style['failed-connection']">
        <h1 :class="$style['failed-connection__text']">
          WebRTC connection issue, please click try again or reload page
        </h1>
        <div :class="$style['failed-connection__try-again']">
          <MyButton text="Try again" :disabled="isConnection" @click="connectToDB" />
        </div>
      </div>
    </template>
    <template v-if="isConnectedToWebRTC">
      <aside :class="[$style['analytics__sidebar']]" :style="genereteLeftWidth">
        <div
          :class="[$style['query-builder'], isShowBackground ? $style['bg-color__side-bar'] : '']"
          @click="openSideBar"
        >
          <QueryBuilder
            v-if="!isShowBackground"
            :curent-key="curentKey"
            :data-number="dataNumber"
            :alias-d-b="aliasDB"
            @toggle="toggleBody"
            @close-side-bar="closeSideBar"
          />
        </div>
      </aside>
      <div :class="$style['line-vertical']" @mousedown="isSidebarMove = true"></div>
      <div
        ref="block"
        :class="[$style['analytics__body'], $style['plice']]"
        :style="{ width: rightWidth + '%' }"
      >
        <div :class="$style['container-big']" :style="{ height: topHeigth + '%' }">
          <QueryTable
            :curent-key="curentKey"
            :data-number="dataNumber"
            :class="$style['w_h-full']"
          />
        </div>
        <div
          :class="[$style['text-editor'], isOpenTextEditor ? '' : $style['bg-color']]"
          :style="genereteHeight"
          @click="openTextEditor"
        >
          <div :class="$style['line']" @mousedown.self="isPassMoveBar = true">
            <div v-if="isOpenTextEditor" :class="$style['cursor']" @click.stop="closeTextEditor">
              <Icon name="arrow-down" :width="15" :height="29" />
            </div>
          </div>
          <div :style="{ height: 95 + '%' }">
            <TextEditor
              v-if="isOpenTextEditor"
              :class="$style['w_h-full']"
              :curent-key="curentKey"
              :data-number="dataNumber"
            />
          </div>
        </div>
      </div>
    </template>
    <QueryDialogSaveSetting :curent-key="curentKey" :data-number="dataNumber" />
  </div>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  onMounted,
  onUnmounted,
  Ref,
  ref,
  watch,
} from 'vue';

import QueryBuilder from '~/components/query-builder/query-builder.vue';
import QueryDialogSaveSetting from '~/components/query-builder/query-dialog-save-setting.vue';
import QueryTable from '~/components/query-builder/query-table/query-table.vue';
import MyButton from '~/components/shared/button.vue';
import Icon from '~/components/shared/icon.vue';
import Loader from '~/components/shared/loader.vue';
import TextEditor from '~/components/shared/text-editor.vue';
import RTCServiceObj from '~/services/api/rtc-service';
import { QueryBuilderModule } from '~/store/modules/query-builder';
import { SaveSettingModule } from '~/store/modules/save-setting';
import { ServerConnectionModule } from '~/store/modules/server-connection';

interface customEvent {
  movementY: number;
  movementX: number;
}

export default defineComponent({
  name: 'QueryBuilderWindow',
  components: {
    MyButton,
    Loader,
    TextEditor,
    QueryBuilder,
    QueryTable,
    Icon,
    QueryDialogSaveSetting,
  },
  props: {
    curentKey: {
      type: Number,
      required: true,
    },
    dataNumber: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const isHidden: Ref<boolean> = ref(true);
    const isFlag: Ref<boolean> = ref(false);

    const isSidebarMove: Ref<boolean> = ref(false);
    const isShowBackground: Ref<boolean> = ref(false);

    const isPassMoveBar: Ref<boolean> = ref(false);
    const isOpenTextEditor: Ref<boolean> = ref(false);

    const leftWidth: Ref<number> = ref(30); // start width sidabar
    const rightWidth: Ref<number> = ref(70); // start width table

    const topHeigth: Ref<number> = ref(98); // start heigth table
    const bottomHeigth: Ref<number> = ref(2); // start heigth text editore

    const oneProcent: Ref<number> = ref(1);
    const y: Ref<number> = ref(0);

    const isProcentForSideBar: Ref<boolean> = ref(true);
    const isProcentForTextEditore = ref(true);
    // TODO do reactive
    const connected: Ref<boolean> = ref(false);
    const isConnection: Ref<boolean> = ref(false);
    const aliasDB: Ref<Array<string>> = ref([]);
    const isShouldReconnect: ComputedRef<boolean> = computed(() => {
      return ServerConnectionModule.isShouldReconnect;
    });
    const failedCount: ComputedRef<number> = computed(() => {
      return ServerConnectionModule.failedCount;
    });

    const isConnectedToWebRTC: ComputedRef<boolean> = computed(() => {
      return ServerConnectionModule.isConnectedToWebRTC;
    });

    const genereteLeftWidth: ComputedRef<{ width: string }> = computed(() => {
      return { width: leftWidth.value + (isProcentForSideBar.value ? '%' : 'px') };
    });
    const genereteHeight: ComputedRef<{ height: string }> = computed(() => {
      return { height: bottomHeigth.value + (isProcentForTextEditore.value ? '%' : 'px') };
    });

    // @Prop({ type: Number }) readonly curentKey!: number;

    // $refs!: {
    //   block: HTMLDivElement;
    //   blockHeigth: HTMLDivElement;
    // };
    const block: any = ref<HTMLElement | null>(null);
    const blockHeigth: any = ref<HTMLElement | null>(null);
    watch(leftWidth, () => {
      showSideBar(leftWidth.value <= 20 && rightWidth.value >= 80 ? true : false); // 10 - width sidebar 90- width table
    });

    watch(failedCount, (value: number) => {
      if (isShouldReconnect.value) {
        if (value <= 2) {
          ServerConnectionModule.connectWithDB();
        }
        if (value > 2) {
          ServerConnectionModule.stopReconnect();
        }
      }
    });

    onMounted(async () => {
      const dataWithKey = await QueryBuilderModule.dataForAllWindows[props.dataNumber as number];
      const data = dataWithKey
        ? dataWithKey.data
          ? dataWithKey.data.map((i: Record<string, unknown>) => i)
          : []
        : [];
      console.log('querybuilder window mount function', props.dataNumber);

      if (data?.length === 0) {
        console.log('is it the first');
        QueryBuilderModule.initStateForWindow(props.dataNumber as number);
        !RTCServiceObj.isConected && (await RTCServiceObj.init(handleConenction));
        await RTCServiceObj.uploadDBAlias();
        closeTextEditor();
      }
      SaveSettingModule.init(props.dataNumber as number);
    });

    onUnmounted(async () => {
      await ServerConnectionModule.disconnectDataBase();
    });

    function moveTextEditore(e: customEvent) {
      /**
       * TODO: handle Refs
       */

      const procent = block.value.clientHeight / 100;
      const ofset = e.movementY / procent;

      if (topHeigth.value > 10 && bottomHeigth.value < 90) {
        cetCoordinatesForTextEditore(ofset);
        if (!(topHeigth.value < 90 && bottomHeigth.value > 10))
          resetCoordinatesForTextEditore(false);
      } else {
        resetCoordinatesForTextEditore(true);
      }
    }

    function cetCoordinatesForTextEditore(ofset: number) {
      topHeigth.value = topHeigth.value + ofset;
      bottomHeigth.value = bottomHeigth.value - ofset;
    }

    function resetCoordinatesForTextEditore(isVertical: boolean) {
      if (isVertical) {
        setHeigthidtchForTextEditor(11, 89);
      } else {
        setHeigthidtchForTextEditor(89, 11);
      }
    }

    function moveSideBar(e: customEvent) {
      /**
       * TODO: handle refs here
       */
      const procent = blockHeigth.value.clientWidth / 100;
      const ofset = e.movementX / procent;

      // 3 is left margin; 97 is right margin
      if (leftWidth.value > 3 && rightWidth.value < 97) setСoordinatesForMove(ofset);

      // 10 is left margin; 90 is right margin
      if (leftWidth.value <= 3 && rightWidth.value >= 97) resetСoordinatesForSideBar();
    }

    function resetСoordinatesForSideBar() {
      setWidthForSideBar(4, 96);
    }

    function showSideBar(isShow: boolean) {
      isShowBackground.value = isShow;
    }

    function setСoordinatesForMove(ofset: number) {
      leftWidth.value = leftWidth.value + ofset;
      rightWidth.value = rightWidth.value - ofset;
    }

    function setHeigthidtchForTextEditor(tHeigth: number, bHeigth: number): void {
      topHeigth.value = tHeigth;
      bottomHeigth.value = bHeigth;
    }

    function setWidthForSideBar(lWidth: number, rWidth: number) {
      leftWidth.value = lWidth;
      rightWidth.value = rWidth;
    }

    function closeTextEditor(): void {
      isOpenTextEditor.value = false;
      isProcentForTextEditore.value = false;
      /**
       * TODO: handle ref here
       */
      if (blockHeigth.value.clientWidth > 900) {
        setHeigthidtchForTextEditor(95, 20);
      } else {
        setHeigthidtchForTextEditor(98, 20);
      }
    }

    function openTextEditor(): void {
      isProcentForTextEditore.value = true;

      if (!isOpenTextEditor.value) {
        isOpenTextEditor.value = true;
        setHeigthidtchForTextEditor(50, 50);
      }
    }

    function closeSideBar(): void {
      isProcentForSideBar.value = false;
      /**
       * TODO: handle ref
       */
      if (blockHeigth.value.clientWidth > 700) {
        setWidthForSideBar(20, 99);
      } else {
        setWidthForSideBar(20, 99);
      }
    }

    function openSideBar(): void {
      isProcentForSideBar.value = true;
      if (isShowBackground.value) setWidthForSideBar(30, 70);
    }

    function move(e: customEvent): void {
      if (isPassMoveBar.value) moveTextEditore(e);
      if (isSidebarMove.value) moveSideBar(e);
    }

    function handleConenction(Connected: boolean, IsConnection: boolean): void {
      connected.value = Connected;
      isConnection.value = IsConnection;
    }

    function toggleBody(): void {
      isHidden.value = !isHidden.value;
    }

    function forceConnect(): void {
      ServerConnectionModule.manualConnect(true);
    }

    async function connectToDB(): Promise<void> {
      !RTCServiceObj.isConected && (await RTCServiceObj.init(handleConenction));
    }

    // get export(): boolean {
    //   return SaveSettingModule.export;
    // }
    return {
      genereteHeight,
      genereteLeftWidth,
      isConnectedToWebRTC,
      failedCount,
      isShouldReconnect,
      connectToDB,
      forceConnect,
      toggleBody,
      handleConenction,
      move,
      openSideBar,
      closeSideBar,
      openTextEditor,
      closeTextEditor,
      setWidthForSideBar,
      setHeigthidtchForTextEditor,
      setСoordinatesForMove,
      showSideBar,
      resetCoordinatesForTextEditore,
      moveSideBar,
      resetСoordinatesForSideBar,
      cetCoordinatesForTextEditore,
      moveTextEditore,
      aliasDB,
      isConnection,
      connected,
      isProcentForSideBar,
      isProcentForTextEditore,
      y,
      oneProcent,
      bottomHeigth,
      topHeigth,
      rightWidth,
      leftWidth,
      isOpenTextEditor,
      isPassMoveBar,
      isShowBackground,
      isSidebarMove,
      isFlag,
      isHidden,
      block,
      blockHeigth,
    };
  },
});
</script>

<style module lang="scss">
.bg-color {
  background-color: gray;
  &__side-bar {
    background-color: gray;
    width: 16px !important;
  }
}

.w_h-full {
  width: 100%;
  height: 100%;
}

.line {
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: row-resize;
}

.analytics {
  &__wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__content-wrapper {
    margin: 31px 15px 31px 28px;
  }

  &__content {
    display: flex;
    overflow: scroll;
    height: 96%;

    &::-webkit-scrollbar {
      width: 6px;
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

  &__sidebar {
    position: relative;
    display: flex;
  }

  &__body {
    margin-left: 0;
    width: 96.4%;
    height: 100%;
    overflow: hidden;
  }
}

.stuffy {
  width: 75%;
}

.margined {
  margin-left: -590px;
}

.connection-message {
  font-size: 14pt;
  margin: 50px auto;
  display: flex;
  align-items: center;

  &__text {
    margin-left: 20px;
  }
}

.failed-connection {
  display: flex;
  align-items: center;
  margin: 20px auto;

  &__text {
    font-weight: 500;
    font-size: 18px;
    color: var(--ink-color);
    margin-right: 30px;
  }

  &__try-again {
    margin-right: 15px;
  }
}
.plice {
  overflow: hidden;
  height: 100%;
  position: relative;
}

.container-big {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.text-editor {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.self-component {
  height: 100% !important;
}
.query-builder {
  width: 100%;
  height: 100%;
}

.line-vertical {
  width: 5px;
  height: 100%;
  cursor: col-resize;
}

.cursor {
  cursor: pointer;
}
</style>
