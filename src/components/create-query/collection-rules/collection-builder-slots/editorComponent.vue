<template>
    <DxTagBox :value="conditionInfo.value"  :input-attr="{ 'aria-label': 'Category' }" width="auto"
        @value-changed="onValueChanged" />
</template>

<script setup lang="ts">
import DxTagBox from 'devextreme-vue/tag-box';

const props = withDefaults(defineProps<{
    conditionInfo?: Record<string, any>
}>(), {
    conditionInfo: () => ({}),
});

function onValueChanged(e) {
    props.conditionInfo.setValue(e.value && e.value.length ? e.value : null);
}
</script>