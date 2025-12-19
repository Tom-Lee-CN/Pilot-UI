import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Pilot from './components/packages/index.js'; // 组件库
import Message from './components/packages/Message/message.js'; // 消息提示组件
import Notification from './components/packages/Notification/index.js'; // 通知组件

const app = createApp(App);

import './styles/index.scss'; // 导入全局样式
app.config.globalProperties.$message = Message; // 全局消息提示
app.config.globalProperties.$notify = Notification; // 全局通知
app.use(Pilot);
app.use(router);
app.mount('#app');
