import { createApp } from '@vue/composition-api';

import App from '~/components/app.vue';
const app = createApp(App);
app.mount('#root');
// new Vue(App).$mount('#root');
