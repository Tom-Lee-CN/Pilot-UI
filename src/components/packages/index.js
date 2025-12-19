import PilotButton from './Button';
import PilotIcon from './Icon';
import PilotAlert from './Alert';
import PilotCard from './Card';
import PilotInput from './Input';
import PilotTextarea from './Textarea';
import PilotSelect from './Select';
import PilotRadio from './Radio';
import PilotRadioGroup from './RadioGroup';
import Row from './Row';
import Col from './Col';
import Modal from './Modal';
import PilotSwitch from './Switch';
import PilotTabs, { PilotTabPane } from './Tabs';
import PilotDrawer from './Drawer';
import PilotLoading from './Loading'; // 导入 Loading 插件
import MessageBox from './MessageBox'; // 1. 导入 MessageBox
import { PilotContainer, PilotHeader, PilotFooter, PilotAside, PilotMain } from './Container';
import PilotLink from './Link';
import PilotBreadcrumb from './Breadcrumb';
import PilotBreadcrumbItem from './BreadcrumbItem';
import PilotScrollbar from './Scrollbar';
import PilotInfiniteScroll from './InfiniteScroll'; // 1. 导入 InfiniteScroll 插件
import PilotSteps from './Steps';
import PilotStep from './Step';
// import PilotMenu from './Menu';
// import PilotMenuItem from './MenuItem';
// import PilotSubmenu from './SubMenu';
import PilotBacktop from './Backtop';

const components = [
  PilotButton,
  PilotIcon,
  PilotAlert,
  PilotCard,
  PilotInput,
  PilotTextarea,
  PilotSelect,
  PilotRadio,
  PilotRadioGroup,
  Row,
  Col,
  Modal,
  PilotSwitch,
  PilotTabs,
  PilotTabPane,
  PilotDrawer,
  // 添加布局组件
  PilotContainer,
  PilotHeader,
  PilotFooter,
  PilotAside,
  PilotMain,
  PilotLink,
  PilotBreadcrumb,
  PilotBreadcrumbItem,
  PilotScrollbar,
  PilotInfiniteScroll,
  PilotSteps,
  PilotStep,
  PilotBacktop,
];

const install = (app) => {
  components.forEach((component) => {
    app.component(component.name, component);
  });

  // 单独注册 Loading 指令插件
  app.use(PilotLoading);
  // 3. 注册 InfiniteScroll 指令
  app.use(PilotInfiniteScroll);
  // 2. 将 MessageBox 挂载到全局
  app.config.globalProperties.$messageBox = MessageBox;
};

export default {
  install,
};

export {
  PilotButton,
  PilotIcon,
  PilotAlert,
  PilotCard,
  PilotInput,
  PilotTextarea,
  PilotSelect,
  PilotRadio,
  PilotRadioGroup,
  Row,
  Col,
  Modal,
  PilotSwitch,
  PilotTabs,
  PilotTabPane,
  PilotDrawer,
  PilotContainer,
  PilotHeader,
  PilotFooter,
  PilotAside,
  PilotMain,
  PilotLink,
  PilotBreadcrumb,
  PilotBreadcrumbItem,
  PilotScrollbar,
  PilotInfiniteScroll,
  PilotSteps,
  PilotStep,
  PilotBacktop,
};
