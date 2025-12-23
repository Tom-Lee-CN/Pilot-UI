import PilotButton from './Button';
import PilotIcon from './Icon';
import PilotAlert from './Alert';
import PilotCard from './Card';
import PilotInput from './Input';
import PilotTextarea from './Textarea';
import { PtSelect as PilotSelect, PtOption as PilotOption } from './Select/index.js';
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
import Message from './Message/message'; // 消息提示组件
import Notification from './Notification'; // 通知组件
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
import PilotCheckbox from './Checkbox';
import PilotCheckboxGroup from './CheckboxGroup';
import { PtDropdown as PilotDropdown, PtDropdownItem as PilotDropdownItem } from './Dropdown';
import { PtCascader as PilotCascader, PtCascaderPanel as PilotCascaderPanel } from './Cascader';

const components = [
  PilotButton,
  PilotIcon,
  PilotAlert,
  PilotCard,
  PilotInput,
  PilotTextarea,
  PilotSelect,
  PilotOption, // 新增：添加 Option 到组件列表
  PilotRadio,
  PilotRadioGroup,
  Row,
  Col,
  Modal,
  PilotSwitch,
  PilotTabs,
  PilotTabPane,
  PilotDrawer,
  PilotContainer, // 添加布局组件
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
  PilotCheckbox,
  PilotCheckboxGroup,
  PilotDropdown,
  PilotDropdownItem,
  // PilotMenu,
  // PilotMenuItem,
  // PilotSubmenu,
  PilotCascader,
  PilotCascaderPanel,
];

const install = (app) => {
  components.forEach((component) => {
    if (component.name) {
      let newName = component.name;
      if (newName.startsWith('Pilot')) {
        // 将 "PilotCard" 替换为 "ptCard"
        newName = 'pt' + newName.substring(5);
      } else {
        // 为 "Row" 和 "Col" 等没有 "Pilot" 前缀的组件也加上前缀
        // 例如 "Row" -> "ptRow"
        newName = 'pt' + newName.charAt(0).toUpperCase() + newName.slice(1);
      }
      app.component(newName, component);
    }
  });

  // 单独注册 Loading 指令插件
  app.use(PilotLoading);
  // 注册 InfiniteScroll 指令
  app.use(PilotInfiniteScroll);
  // 将 MessageBox 挂载到全局
  app.config.globalProperties.$messageBox = MessageBox;
  // 全局消息提示
  app.config.globalProperties.$message = Message;
  // 全局通知
  app.config.globalProperties.$notify = Notification;
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
  PilotOption, // 新增：添加 Option 到组件列表
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
  PilotCheckbox,
  PilotCheckboxGroup,
  PilotDropdown,
  PilotDropdownItem,
  PilotCascader,
  PilotCascaderPanel,
};
