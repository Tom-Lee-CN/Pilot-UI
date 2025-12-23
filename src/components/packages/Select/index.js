import PtSelect from './select.vue';
import PtOption from './option.vue';

// 为组件提供 install 安装方法，供按需引入
PtSelect.install = (app) => {
  app.component(PtSelect.name, PtSelect);
};

PtOption.install = (app) => {
  app.component(PtOption.name, PtOption);
};

// 默认导出组件
export { PtSelect, PtOption };
