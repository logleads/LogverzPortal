import { createApp } from 'vue';

import App from '~/components/app.vue';
const app = createApp(App);
app.mount('#root');
console.log('version', app.version);
// new Vue(App).$mount('#root');
