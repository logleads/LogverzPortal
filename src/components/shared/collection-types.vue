<template>
  <div class="collection-filter">
    <span
      :class="[activeCollectionFilter === 'A' && 'span-active']"
      @click="changeCollectionType('A')"
      >Analysis</span
    >
    <span
      :class="[activeCollectionFilter === 'C' && 'span-active']"
      @click="changeCollectionType('C')"
      >Collection</span
    >
    <span
      :class="[activeCollectionFilter === 'CC' && 'span-active']"
      @click="changeCollectionType('CC')"
      >Continous Collection</span
    >
  </div>
</template>

<script lang="ts">
import 'devextreme/dist/css/dx.light.css';

import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'collectionTypes',

  setup(props, { emit }) {
    const activeCollectionFilter = ref('');
    const collectionType = ref(['A', 'C', 'CC']);

    onMounted(() => {
      changeCollectionType('C');
    });

    function changeCollectionType(type: string): void {
      emit('collection-filter-change', type);
      activeCollectionFilter.value = type;
    }

    return {
      changeCollectionType,
      activeCollectionFilter,
      collectionType,
    };
  },
});
</script>

<style scoped lang="scss">
.collection-filter {
  border: 1px solid rgba(43, 42, 44, 0.4);
  margin: 0 10px 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 6px;
  cursor: pointer;
}

.collection-filter span {
  display: flex;
  align-items: center;
  padding: 0px 10px;
  height: 100%;
}

.collection-filter span:hover {
  // border-bottom: 2px solid blue;
  background-color: rgb(238, 238, 238);
}

.span-active {
  background-color: #88c4be;
  height: 100%;
}

.custome-collection-filter {
  position: absolute;
  background-color: grey;
  width: 350px;
  height: 300px;
  z-index: 1000;
  top: 40px;
}

.custome-collection-filter input {
  background-color: white;
}

.custome-collection-filter-form {
  padding: 20px;
}

.custome-collection-filter-form p {
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
