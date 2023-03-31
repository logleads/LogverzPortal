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
import { Component, Prop, Vue } from 'vue-property-decorator';

import { SaveSettingModule } from '~/store/modules/save-setting';

@Component({
  name: 'TextEditor',
  components: {
    Editor,
  },
})
export default class TextEditor extends Vue {
  @Prop({ type: Number }) readonly curentKey!: number;
  // public  viewerText: string = '# This is Viewer.\n Hello World.'

  public content: string = 'sdf';
  $refs!: {
    editor: any;
  };
  public defaultOptions = {
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
  };

  public onEditorChange(editor: InputEvent): void {
    const text = this.$refs.editor.$refs.toastuiEditor.innerText.replace('MarkdownWYSIWYG', '');
    const textS = text.split('\n\n');
    textS.pop();

    for (let i = 0; i < textS.length / 2; i++) {
      textS.pop();
    }
    // eslint-disable-next-line no-console
    console.log(textS.join('\n\n'), 'textS');
    SaveSettingModule.setTextEditor({
      data: textS.join('\n\n'),
      key: this.curentKey,
    });
  }

  public onEditorFocus(editor: InputEvent): void {
    // eslint-disable-next-line no-console
    console.log('editor focus!', editor);
  }

  public onEditorLoad(editor: InputEvent): void {
    // eslint-disable-next-line no-console
    console.log('editor ready!', editor);
  }

  get editorText(): string {
    return SaveSettingModule.dataT[this.curentKey].textEditor;
  }
}
</script>

<style module lang="scss">
.editor {
  height: 100%;
}
</style>
