import 'vue3-json-viewer/dist/index.css';
import 'highlight.js/styles/default.css';

import { createApp } from 'vue';
import VueHighlightJS from 'vue3-highlightjs';
import JsonViewer from 'vue3-json-viewer';

import App from '~/components/app.vue';
const app = createApp(App);
app.use(JsonViewer);
app.use(VueHighlightJS);
app.mount('#root');
console.log('version', app.version);
