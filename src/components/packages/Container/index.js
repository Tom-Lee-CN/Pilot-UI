import PilotContainer from './container.vue';
import PilotHeader from './header.vue';
import PilotFooter from './footer.vue';
import PilotAside from './aside.vue';
import PilotMain from './main.vue';

// 为每个组件添加 install 方法，以便可以单独按需引入
PilotContainer.install = (app) => app.component(PilotContainer.name, PilotContainer);
PilotHeader.install = (app) => app.component(PilotHeader.name, PilotHeader);
PilotFooter.install = (app) => app.component(PilotFooter.name, PilotFooter);
PilotAside.install = (app) => app.component(PilotAside.name, PilotAside);
PilotMain.install = (app) => app.component(PilotMain.name, PilotMain);

// 使用命名导出，方便在主 `index.js` 中按需导入和重导出
export { PilotContainer, PilotHeader, PilotFooter, PilotAside, PilotMain };
