<template>
  <editor
    ref="editor"
    initial-edit-type="markdown"
    :initial-value="editorText"
    height="100%"
    :style="$style['editor']"
    :options="defaultOptions"
    @load="onEditorLoad"
    @focus="onEditorFocus"
    @change="onEditorChange"
  />
</template>

<script lang="ts">
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/vue-editor';
import { computed, ComputedRef, defineComponent, Ref, ref } from '@vue/composition-api';

import { SaveSettingModule } from '~/store/modules/save-setting';

export default defineComponent({
  name: 'TextEditor',
  components: {
    Editor,
  },
  props: {
    curentKey: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const content: Ref<string> = ref('sdf');
    const editor: Ref<any> = ref('');
    const defaultOptions = ref({
      language: 'en-US',
      useCommandShortcut: true,
      useDefaultHTMLSanitizer: true,
      usageStatistics: true,
      hideModeSwitch: false,
      toolbarItems: [
        'heading',
        'bold',
        'italic',
        'strike',
        'divider',
        'hr',
        'quote',
        'divider',
        'ul',
        'ol',
        'task',
        'indent',
        'outdent',
        'divider',
        'table',
        // 'image',
        'link',
        'divider',
        'code',
        'codeblock',
      ],
    });

    function onEditorChange(editor: any): void {
      const text = editor?.innerText.replace('MarkdownWYSIWYG', '');
      // const text = editor.$refs.toastuiEditor.innerText.replace('MarkdownWYSIWYG', '');
      const textS = text.split('\n\n');
      textS.pop();

      for (let i = 0; i < textS.length / 2; i++) {
        textS.pop();
      }
      // eslint-disable-next-line no-console
      console.log(textS.join('\n\n'), 'textS');
      SaveSettingModule.setTextEditor({
        data: textS.join('\n\n'),
        key: props.curentKey,
      });
    }

    function onEditorFocus(editor: InputEvent): void {
      // eslint-disable-next-line no-console
      console.log('editor focus!', editor);
    }

    function onEditorLoad(editor: InputEvent): void {
      // eslint-disable-next-line no-console
      console.log('editor ready!', editor);
    }

    const editorText: ComputedRef<string> = computed(() => {
      return SaveSettingModule.dataT[props.curentKey].textEditor;
    });

    return {
      editorText,
      onEditorChange,
      onEditorLoad,
      onEditorFocus,
      content,
      editor,
      defaultOptions,
    };
  },
});
</script>

<style module lang="scss">
.editor {
  height: 100%;
}
</style>
