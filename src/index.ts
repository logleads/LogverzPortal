// import 'highlight.js/styles/solarized-light.css'
import { createApp } from 'vue';
import JsonViewer from 'vue3-json-viewer';

// import VueHighlightJS from 'vue3-highlightjs'
import App from '~/components/app.vue';
const app = createApp(App);
app.use(JsonViewer);
app.mount('#root');
console.log('version', app.version);

// app.use(VueHighlightJS)
