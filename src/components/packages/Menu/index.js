import PilotMenu from './Menu.vue';
import PilotMenuItem from './MenuItem.vue';
import PilotSubMenu from './SubMenu.vue';

// 插件写法
const MenuPlugin = {
  install(Vue) {
    Vue.component('pilot-menu', PilotMenu);
    Vue.component('pilot-menu-item', PilotMenuItem);
    Vue.component('pilot-sub-menu', PilotSubMenu);
  },
};

export default MenuPlugin;
