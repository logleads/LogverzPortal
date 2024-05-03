<template>
  <div :class="$style['time-filter']">
    <span :class="[activeTimeFilter === '4h' && $style['span-active']]" @click="giveLast4h"
      >4h</span
    >
    <span :class="[activeTimeFilter === '1day' && $style['span-active']]" @click="giveLast1day"
      >1day</span
    >
    <span :class="[activeTimeFilter === '1week' && $style['span-active']]" @click="giveLast1week"
      >1week</span
    >
    <span :class="[activeTimeFilter === '30day' && $style['span-active']]" @click="giveLast30day"
      >30day</span
    >
    <span @click="clear">clear</span>
    <span @click="openCustomTimeRangeBlock">custom</span>
    <div v-if="customTimeRange" :class="$style['custome-time-filter']">
      <div :class="$style['custome-time-filter-form']">
        <p for="timeRange">Choose number value</p>
        <Input
          id="timeRange"
          :value="timeRange"
          name="timeRange"
          :min="1"
          :type="'number'"
          @input="handleInput({ value: $event, label: 'timeRange' })"
        />
        <p for="timePeriod">Choose time period</p>
        <DropDownSimple
          :content="timePeriod"
          :items="timePeriods"
          name="timePeriod"
          @select-value="handleTimePeriod"
        />
      </div>
      <div :class="$style['btn-place']">
        <button :class="$style['btn']" @click="cencelBtn">Cancel</button>
        <button :class="$style['btn']" @click="applyBtn">Apply</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'devextreme/dist/css/dx.light.css';

import { defineComponent, onMounted, ref } from 'vue';
import { alert } from 'devextreme/ui/dialog';

import DropDownSimple from '~/components/shared/drop-down-simple.vue';
import Input from '~/components/shared/input.vue';
import { calcTimeRangeFromNowToNeedsTimeUTC } from '~/utils/parsTimeUTC';

export default defineComponent({
  name: 'TimerFilter',
  components: {
    DropDownSimple,
    // eslint-disable-next-line vue/no-reserved-component-names
    Input,
  },
  setup(props, { emit }) {
    const activeTimeFilter = ref('');
    const customTimeRange = ref(false);
    const timePeriod = ref('');
    const timePeriods = ref(['minute', 'hour', 'day', 'week', 'month', 'year']);
    const timeRange = ref('');
    const unixTime = ref(0);

    onMounted(() => {
      giveLast1week();
    });

    function handleInput(payload: { label: string; value: string }): void {
      timeRange.value = payload.value;
    }

    function handleTimePeriod(data: { item: string }): void {
      timePeriod.value = data.item;
    }

    function openCustomTimeRangeBlock(): void {
      customTimeRange.value = true;
    }

    function cencelBtn(): void {
      timePeriod.value = '';
      customTimeRange.value = false;
      timeRange.value = '';
      activeTimeFilter.value = '';
      unixTime.value = 0;
    }

    function applyBtn(): void {
      if (timeRange.value === '') {
        alert('Please select the required time value', 'Something went wrong');
        return;
      }

      if (timePeriod.value === '') {
        alert('Please select the required time interval', 'Something went wrong');
        return;
      }

      if (!timePeriods.value.includes(timePeriod.value)) {
        alert('time period is not correct', 'Something went wrong');
        return;
      }

      const unixTime = calcTimeRangeFromNowToNeedsTimeUTC(
        parseInt(timeRange.value, 10),
        timePeriod.value,
      );

      unixTimeChange(unixTime);
      cencelBtn();
      activeTimeFilter.value = '';
    }

    function giveLast4h(): void {
      const unixTime = calcTimeRangeFromNowToNeedsTimeUTC(4, 'hour');
      unixTimeChange(unixTime);
      cencelBtn();
      activeTimeFilter.value = '4h';
    }

    function giveLast1day(): void {
      const unixTime = calcTimeRangeFromNowToNeedsTimeUTC(1, 'day');
      unixTimeChange(unixTime);
      cencelBtn();
      activeTimeFilter.value = '1day';
    }

    function giveLast1week(): void {
      const unixTime = calcTimeRangeFromNowToNeedsTimeUTC(1, 'week');
      unixTimeChange(unixTime);
      cencelBtn();
      activeTimeFilter.value = '1week';
    }

    function giveLast30day(): void {
      const unixTime = calcTimeRangeFromNowToNeedsTimeUTC(30, 'day');
      unixTimeChange(unixTime);
      cencelBtn();
      activeTimeFilter.value = '30day';
    }

    // @Emit()
    function clear(): void {
      unixTime.value = 0;
      activeTimeFilter.value = '';
      emit('clear');
    }

    // @Emit()
    function unixTimeChange(unixTime: number): number {
      emit('unix-time-change', unixTime);
      return unixTime;
    }

    return {
      unixTimeChange,
      clear,
      giveLast30day,
      giveLast1week,
      giveLast1day,
      giveLast4h,
      applyBtn,
      cencelBtn,
      openCustomTimeRangeBlock,
      handleTimePeriod,
      handleInput,
      activeTimeFilter,
      customTimeRange,
      timePeriod,
      timePeriods,
      timeRange,
      unixTime,
    };
  },
});
</script>

<style module lang="scss">
.time-filter {
  border: 1px solid rgba(43, 42, 44, 0.4);
  margin: 0 10px 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 6px;
  cursor: pointer;
}

.time-filter span {
  display: flex;
  align-items: center;
  padding: 0px 10px;
  height: 100%;
}

.time-filter span:hover {
  // border-bottom: 2px solid blue;
  background-color: rgb(238, 238, 238);
}

.span-active {
  background-color: #88c4be;
  height: 100%;
}

.custome-time-filter {
  position: absolute;
  background-color: grey;
  width: 350px;
  height: 300px;
  z-index: 1000;
  top: 40px;
}

.custome-time-filter input {
  background-color: white;
}

.custome-time-filter-form {
  padding: 20px;
}

.custome-time-filter-form p {
  margin-bottom: 10px;
  margin-top: 10px;
  color: white;
  font-weight: 500;
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

.btn-place {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
<style>
#gridSettings {
  max-width: 100%;
  width: 100%;
}
</style>
