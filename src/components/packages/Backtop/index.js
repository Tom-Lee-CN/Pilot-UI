import PilotBacktop from './backtop.vue';

// 为组件提供 install 安装方法，供 Vue.use() 全局注册
PilotBacktop.install = (app) => {
  app.component(PilotBacktop.name, PilotBacktop);
};

// 默认导出组件
export default PilotBacktop;
