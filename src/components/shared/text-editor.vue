<template>
  <div>
    <div ref="editorEl" :style="$style['editor']" />
  </div>
</template>

<script lang="ts">
import '@toast-ui/editor/dist/toastui-editor.css';

import Editor from '@toast-ui/editor';
import { defineComponent, onMounted, ref, watch } from 'vue';

export default defineComponent({
  name: 'TextEditor',
  props: {
    editorText: {
      type: String,
      default: '',
    },
  },
  emits: ['change', 'load', 'focus'],
  setup(props, { emit }) {
    const editorEl = ref<HTMLElement | null>(null);
    let editorInstance: Editor | null = null;

    const defaultOptions = {
      // your editor options here
      minHeight: '200px',
      language: 'en',
      useCommandShortcut: true,
    };

    onMounted(() => {
      if (!editorEl.value) return;

      editorInstance = new Editor({
        el: editorEl.value,
        initialEditType: 'markdown',
        initialValue: props.editorText,
        height: '100%',
        ...defaultOptions,
      });

      // Handle events
      editorInstance.on('load', () => {
        emit('load', editorInstance);
      });

      editorInstance.on('change', () => {
        emit('change', editorInstance?.getMarkdown());
      });

      editorInstance.on('focus', () => {
        emit('focus', editorInstance);
      });
    });

    // Watch for external value changes
    watch(
      () => props.editorText,
      newValue => {
        if (editorInstance && newValue !== editorInstance.getMarkdown()) {
          editorInstance.setMarkdown(newValue);
        }
      },
    );

    return {
      editorEl,
    };
  },
});
</script>

<style module lang="scss">
.editor {
  height: 100%;
}
</style>
