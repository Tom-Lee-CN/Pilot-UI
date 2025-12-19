import Scrollbar from './scrollbar.vue';

// 为组件提供 install 安装方法，供按需引入
Scrollbar.install = (app) => {
  app.component(Scrollbar.name, Scrollbar);
};

export default Scrollbar;
