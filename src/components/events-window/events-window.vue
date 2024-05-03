<template>
  <div :class="$style['table-query-history']">
    <div :class="$style['table']">
      <TimerFilter @clear="clear" @unix-time-change="timeFilter" />
      <div :class="$style['table__header__buttons']">
        <button
          :class="[
            $style['table__header__buttons__btn'],
            $style['border-radius-left'],
            { [$style['active']]: tableContent },
          ]"
          @click="changeTableContent(true)"
        >
          Groupped events
        </button>
        <button
          :class="[
            $style['table__header__buttons__btn'],
            $style['border-radius-right'],
            { [$style['active']]: !tableContent },
          ]"
          @click="changeTableContent(false)"
        >
          Specific events
        </button>
      </div>

      <template v-if="tableContent">
        <!-- <DxSelectBox
          v-model="searchMode"
          :items="[
            'Category:User',
            'Category:Infra',
            'Severity:Info',
            'Severity:Error',
            'Type:API',
            'Type:SQL',
            'Clear',
          ]"
        /> -->
        <select v-model="searchMode" name="searchMode" class="searchMode">
          <optgroup label="Category">
            <option value="Category:User">User</option>
            <option value="Category:Infra">Infra</option>
          </optgroup>
          <optgroup label="Severity">
            <option value="Severity:Info">Info</option>
            <option value="Severity:Error">Error</option>
          </optgroup>
          <optgroup label="Type">
            <option value="Type:API">API</option>
            <option value="Type:SQL">SQL</option>
          </optgroup>
          <option value="Clear">Clear</option>
        </select>
      </template>
      <template v-else>
        <div :class="$style['choose_action']">
          <Input
            id="actionsValue"
            :value="actionsValue"
            name="actionsValue"
            :placeholder="'Type Action'"
            :type="'string'"
            @input="handleInputAction({ value: $event, label: 'actionsValue' })"
          />
          <div :class="$style['btn-place']">
            <button :class="$style['btn']" @click="getActions">Apply</button>
          </div>
        </div>
      </template>
    </div>
    <template v-if="isFetch">
      <Loader accent />
    </template>
    <template v-else>
      <template v-if="canvas === 'Groupped events'">
        <div :class="$style['event-window']">
          <h1>Category</h1>
          <h2>User</h2>
          <EventTable :searce="user" />
          <h2>Infra</h2>
          <EventTable :searce="infra" />
        </div>
        <div :class="$style['event-window']">
          <h1>Severity</h1>
          <h2>Info</h2>
          <EventTable :searce="info" />
          <h2>Error</h2>
          <EventTable :searce="error" />
        </div>
      </template>
      <template v-if="canvas === 'Specific events'">
        <div>
          <h1>Specific events</h1>
          <div :class="$style['choose_action']"></div>
          <EventTable :searce="actions" />
        </div>
      </template>
      <template v-if="canvas === 'Select events'">
        <div>
          <h1>Select events</h1>
          <EventTable :searce="selectEvents" />
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import 'devextreme/dist/css/dx.light.css';

import { defineComponent, Ref, ref, watch } from 'vue';

import EventTable from '~/components/events-window/event-tible.vue';
import Input from '~/components/shared/input.vue';
import Loader from '~/components/shared/loader.vue';
import TimerFilter from '~/components/shared/time-filter.vue';
import { EventsWindowService } from '~/services/api/events-window-service';
import { ErrorsModule } from '~/store/modules/errors';
import { transformDataFromResponse } from '~/utils/transformDataFromResponse';

enum TableContent {
  SelectEvents = 'Select events',
  SpecificEvents = 'Specific events',
  GrouppedEvents = 'Groupped events',
}

export default defineComponent({
  name: 'EventsWindow',
  components: {
    Loader,
    Input,
    TimerFilter,
    EventTable,
  },
  setup() {
    const reuseTableName: Ref<boolean> = ref(false);
    const tableMode: Ref<boolean> = ref(false);
    const tableContent: Ref<boolean> = ref(true);
    const isFetch: Ref<boolean> = ref(false);
    const events: Ref<any> = ref([]);
    const user: Ref<any> = ref([]);
    const infra: Ref<any> = ref([]);
    const info: Ref<any> = ref([]);
    const error: Ref<any> = ref([]);
    const searchMode: Ref<string> = ref('');
    const conditional: Ref<boolean> = ref(true);
    const canvas: Ref<TableContent> = ref(TableContent.GrouppedEvents);
    const actions: Ref<any> = ref([]);
    const actionsValue: Ref<string> = ref('');
    const selectEvents: Ref<any> = ref([]);
    const unixTime: Ref<number> = ref(0);

    function changeTableMode(value: boolean): void {
      tableMode.value = value;
    }

    async function startAllCallApi(limit: number): Promise<void> {
      try {
        const localUser = await EventsWindowService.getEventsActionUsedLimit(
          'Category',
          'User',
          limit,
        );
        user.value = [...transformDataFromResponse(localUser)];

        const localInfra = await EventsWindowService.getEventsActionUsedLimit(
          'Category',
          'Infra',
          limit,
        );
        infra.value = [...transformDataFromResponse(localInfra)];

        const localInfo = await EventsWindowService.getEventsActionUsedLimit(
          'Severity',
          'Info',
          limit,
        );
        info.value = [...transformDataFromResponse(localInfo)];

        const localError = await EventsWindowService.getEventsActionUsedLimit(
          'Severity',
          'Error',
          limit,
        );
        error.value = [...transformDataFromResponse(localError)];
      } catch (e: any) {
        ErrorsModule.showErrorMessage(e.message);
      }
    }

    async function startAllCallApiWithTime(unix: number): Promise<void> {
      try {
        const localUser = await EventsWindowService.getEventsActionWithTime(
          'Category',
          'User',
          unix,
        );
        user.value = [...transformDataFromResponse(localUser)];

        const localInfra = await EventsWindowService.getEventsActionWithTime(
          'Category',
          'Infra',
          unix,
        );
        infra.value = [...transformDataFromResponse(localInfra)];

        const localInfo = await EventsWindowService.getEventsActionWithTime(
          'Severity',
          'Info',
          unix,
        );
        info.value = [...transformDataFromResponse(localInfo)];

        const localError = await EventsWindowService.getEventsActionWithTime(
          'Severity',
          'Error',
          unix,
        );
        error.value = [...transformDataFromResponse(localError)];
      } catch (e: any) {
        ErrorsModule.showErrorMessage(e.message);
      }
    }

    async function changeTableContent(value: boolean): Promise<void> {
      canvas.value = value ? TableContent.GrouppedEvents : TableContent.SpecificEvents;
      tableContent.value = value;
    }

    function handleInputAction(payload: { label: string; value: string }): void {
      actionsValue.value = payload.value;
    }

    async function clear(): Promise<void> {
      isFetch.value = true;
      canvas.value = TableContent.GrouppedEvents;
      try {
        await startAllCallApi(10);
      } catch (e: any) {
        ErrorsModule.showErrorMessage(e.message);
      }
      searchMode.value = '';
      isFetch.value = false;
    }

    async function timeFilter(unixTimeParam: number): Promise<void> {
      unixTime.value = unixTimeParam;
      isFetch.value = true;
      try {
        switch (canvas.value) {
          case TableContent.SelectEvents: {
            await chooseAction(searchMode.value, unixTimeParam);
            break;
          }
          case TableContent.GrouppedEvents: {
            await startAllCallApiWithTime(unixTimeParam);
            break;
          }
          case TableContent.SpecificEvents: {
            const data = await EventsWindowService.getEventsActionWithTime(
              'Action',
              actionsValue.value,
              unixTimeParam,
            );
            actions.value = [...transformDataFromResponse(data)];
            break;
          }
          default:
            break;
        }
      } catch (e: any) {
        ErrorsModule.showErrorMessage(e.message);
      }
      isFetch.value = false;
    }

    async function getActions(): Promise<void> {
      const data = await EventsWindowService.getEventsActionWithTime(
        'Action',
        actionsValue.value,
        unixTime.value,
      );
      actions.value = [...transformDataFromResponse(data)];
    }

    watch(searchMode, async (value: string) => {
      isFetch.value = false;
      canvas.value = TableContent.SelectEvents;
      await chooseAction(value, unixTime.value);
      isFetch.value = false;
    });

    async function chooseAction(value: string, unixTime?: number): Promise<void> {
      const fn = unixTime
        ? EventsWindowService.getEventsActionWithTime
        : EventsWindowService.getEventsAction;
      switch (value) {
        case 'Category:User': {
          const selectEventsLocal = await fn('Category', 'User', unixTime as number);
          selectEvents.value = [...transformDataFromResponse(selectEventsLocal)];
          break;
        }
        case 'Category:Infra': {
          const selectEventsLocal = await fn('Category', 'Infra', unixTime as number);
          selectEvents.value = [...transformDataFromResponse(selectEventsLocal)];
          break;
        }

        case 'Severity:Info': {
          const selectEventsLocal = await fn('Severity', 'Info', unixTime as number);
          selectEvents.value = [...transformDataFromResponse(selectEventsLocal)];
          break;
        }

        case 'Severity:Error': {
          const selectEventsLocal = await fn('Severity', 'Error', unixTime as number);
          selectEvents.value = [...transformDataFromResponse(selectEventsLocal)];
          break;
        }

        case 'Type:API': {
          const selectEventsLocal = await fn('Type', 'API', unixTime as number);
          selectEvents.value = [...transformDataFromResponse(selectEventsLocal)];
          break;
        }

        case 'Type:SQL': {
          const selectEventsLocal = await fn('Type', 'SQL', unixTime as number);
          selectEvents.value = [...transformDataFromResponse(selectEventsLocal)];
          break;
        }

        case 'Clear': {
          selectEvents.value = [];
          canvas.value = TableContent.GrouppedEvents;
          break;
        }

        default:
          break;
      }
    }
    return {
      chooseAction,
      getActions,
      timeFilter,
      clear,
      handleInputAction,
      changeTableContent,
      startAllCallApiWithTime,
      startAllCallApi,
      changeTableMode,
      reuseTableName,
      tableMode,
      tableContent,
      isFetch,
      events,
      user,
      infra,
      info,
      error,
      searchMode,
      conditional,
      canvas,
      actions,
      actionsValue,
      selectEvents,
      unixTime,
    };
  },
});
</script>

<style module lang="scss">
.event-window {
  margin-bottom: 20px;
}
h1 {
  font-size: 20px;
  font-weight: 900;
}

h2 {
  margin: 10px 0 10px 0;
  font-size: 18px;
  font-weight: 800;
}

.choose_action {
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    font-size: 20px;
    font-weight: 500;
  }

  .btn-place {
    padding: 0 20px 0 20px;
  }
}
.table-query-history {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow: scroll;
}

.btn {
  background-color: white;
  color: var(--accent-color);
  width: 70px;
  height: 30px;
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

.btn-place {
  // padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.popup {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(43, 42, 44, 0.4);
  z-index: 3;

  &__body {
    position: absolute;
    overflow: scroll;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: 60%;
    background-color: white;
    min-height: 500px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }
}

.additional-settings {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 90%;
  margin: 20px 0 20px 76px;

  &__checkbox {
    margin-right: 20px;
  }

  &__label {
    font-weight: 500;
    font-size: 15px;
    color: var(--ink-color);
  }
}

.table {
  display: flex;
  width: 100%;
  margin: 15px 0;
  height: 30px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
      width: 233px;
      height: 100%;

      &__btn {
        width: 111px;
        height: 27px;
        font-weight: 500;
        font-size: 12px;
        color: #242222;
        background-color: #ffffff;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.03);
        border: 1px solid rgba(43, 42, 44, 0.4);
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
.searchMode {
  margin-top: 3px;
  padding: 2px;
  width: 120px;
  border-top: 1px solid gray;
}
</style>
<style>
#gridSettings {
  max-width: 100%;
  width: 100%;
}
</style>
