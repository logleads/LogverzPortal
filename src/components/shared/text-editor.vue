<template>
  <!-- <editor
    ref="editor"
    initial-edit-type="markdown"
    :initial-value="editorText"
    height="100%"
    :style="$style['editor']"
    :options="defaultOptions"
    @load="onEditorLoad"
    @focus="onEditorFocus"
    @change="onEditorChange"
  /> -->
  <!-- <h1>Hello</h1> -->
  <div>
    <div ref="editor" />
  </div>
</template>

<script lang="ts">
// import 'codemirror/lib/codemirror.css';

import '@toast-ui/editor/dist/toastui-editor.css';

import Editor from '@toast-ui/editor';
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref } from 'vue';

import { SaveSettingModule } from '~/store/modules/save-setting';

export default defineComponent({
  name: 'TextEditor',
  // components: {
  //   editor: Editor,
  // },
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
    // const emit = defineEmits(['update:modelValue']);
onMounted(() => {
  const e = new Editor({
    el: editor.value,
    // height: '500px',
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    events: {
      change: () =>onEditorChange(e.getMarkdown()) ,
    },
  });
});

    function onEditorChange(editor: any): void {
      
      const text = editor?.replace('MarkdownWYSIWYG', '');
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
        key: props.dataNumber,
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
      return SaveSettingModule.dataT[props.dataNumber].textEditor;
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
