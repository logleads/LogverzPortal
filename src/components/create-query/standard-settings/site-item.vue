<template>
  <li :class="$style['node-tree']">
    <template v-if="!rootFolderFetching">
      <div
        v-if="typeof path === 'object' && label"
        :class="[$style['item'], { [$style['main']]: deep === 2 }]"
        @click="toggleExpanded()"
      >
        <Icon
          v-if="deep === 2 && !expanded"
          name="add-square"
          :height="13"
          :width="13"
          fill="#88c4be"
        />
        <Icon
          v-if="deep === 2 && expanded"
          name="expanded-minus"
          :height="14"
          :width="14"
          fill="#88c4be"
        />
        <Icon v-if="deep > 2 && !expanded" name="list" :height="13" :width="13" fill="red" />
        <Icon
          v-if="deep > 2 && expanded"
          name="list-selected"
          :height="13"
          :width="13"
          fill="red"
        />
        <span :class="[$style['item__content'], { [$style['selected']]: expanded }]">{{
          emptyPipe(label)
        }}</span>
      </div>
      <ul v-if="typeof path !== 'string' && (expanded || !label) && !fetching">
        <template v-for="(child, i) in path">
          <template v-if="child !== null && !Array.isArray(child)">
            <SiteItem
              :key="i + Math.random() * 10000"
              :path="child"
              :label="i.toString()"
              :deep="deep + 1"
              :root-folder-fetching="false"
              @selectPath="selectPath"
            />
          </template>
        </template>
      </ul>
      <template v-if="typeof path === 'string'">
        <span
          :class="[$style['end-path'], { [$style['selected']]: expanded }]"
          @click="toggleExpanded()"
        >
          {{ emptyPipe(label) }}
        </span>
      </template>
    </template>
    <template v-else>
      <Loader accent />
    </template>
  </li>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  onMounted,
  ref,
  watch,
} from '@vue/composition-api';

import Icon from '~/components/shared/icon.vue';
import Loader from '~/components/shared/loader.vue';
import { DataCollectionModule } from '~/store/modules/data-collection';
import { checkIsEmpty } from '~/utils/pipes';

// @Component({
//   name: 'SiteItem',
//   components: {
//     Loader,
//     Icon,
//   },
// })
export default defineComponent({
  name: 'SiteItem',
  components: {
    Loader,
    Icon,
  },
  props: {
    path: {
      type: Object,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    deep: {
      type: Number,
      required: true,
    },
    subFetch: {
      type: Array,
      required: false,
    },
    rootFolderFetching: {
      type: Boolean,
      required: false,
    },
  },
  // @Prop({ required: true }) readonly path!: PathType;
  // @Prop({ required: false, type: String }) readonly label!: string;
  // @Prop({ required: false, type: Number }) readonly deep!: number;
  // @Prop({ required: false, type: Array }) readonly subFetch!: Array<{
  //   path: string;
  //   fetching: boolean;
  // }>;
  // @Prop({ required: false, type: Boolean }) readonly rootFolderFetching!: boolean;
  setup(props, { emit }) {
    const expanded = ref(false);
    const fetching = ref(false);

    const currentPath: ComputedRef<string> = computed(() => {
      return DataCollectionModule.s3Folders;
    });

    onMounted(() => {
      expanded.value = DataCollectionModule.expandedPath.includes(props?.label + props?.deep);
    });

    const subFoldersFetch: ComputedRef<Array<{ path: string; fetching: boolean }>> = computed(
      () => {
        return DataCollectionModule.subFoldersFetch;
      },
    );
    watch(subFoldersFetch, (value: Array<{ path: string; fetching: boolean }>) => {
      const find = value.filter(i => i.path === currentPath.value);
      if (find.length) {
        fetching.value = find[0].fetching;
      }
    });

    watch(expanded, (value: boolean) => {
      if (value) {
        DataCollectionModule.setExpanded({ value: props.label + props.deep, delete: false });
      } else {
        DataCollectionModule.setExpanded({ value: props.label + props.deep, delete: true });
      }
    });

    function toggleExpanded(): void {
      expanded.value = !expanded.value;
      emit('selectPath', { value: props.label, expanded: expanded.value, deep: props.deep });
      Object.keys(props.path).forEach((item: any) => {
        if (props.path[item] === '*') {
          if (item === '0') {
            DataCollectionModule.getPath(currentPath.value);
          }
        }
      });
    }

    function emptyPipe(value: string): string {
      return checkIsEmpty(value);
    }

    function selectPath(payload: { value: string; expanded: boolean; deep: number }): void {
      DataCollectionModule.setFoldersPath(payload);
    }
    return {
      selectPath,
      emptyPipe,
      checkIsEmpty,
      toggleExpanded,
      subFoldersFetch,
      currentPath,
      fetching,
      expanded,
    };
  },
});
</script>

<style module lang="scss">
.end-path {
  padding-left: 23px;
}

.node-tree {
  list-style: none;
}

ul {
  list-style: none;
  padding-left: 20px;

  > li {
    cursor: pointer;
    margin-bottom: 9px;
    font-size: 12px;
    line-height: 100%;
    color: #000000;
    display: block;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
  }
}

.item {
  font-size: 12px;
  color: #000000;
  width: 100%;
  margin: 9px 0;
  &__content {
    margin-left: 7px;
  }
}
.main {
  font-weight: 500;
  font-size: 16px;
  color: var(--accent-color);
}
.selected {
  color: #88c4be;
}
</style>
