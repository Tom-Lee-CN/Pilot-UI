import PilotTabs from './tabs.vue';
import PilotTabPane from './tab-pane.vue';

// 将 TabPane 附加到 Tabs 上，这是一种常见实践，方便用户访问
PilotTabs.TabPane = PilotTabPane;

// 默认导出主组件
export default PilotTabs;

// 同时命名导出 TabPane，以便我们可以在主注册文件中单独导入它
export { PilotTabPane };
