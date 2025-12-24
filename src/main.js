import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Pilot from './components/packages/index.js'; // 组件库

const app = createApp(App);

import './styles/index.scss'; // 导入全局样式
app.use(Pilot);
app.use(router);
app.mount('#app');
