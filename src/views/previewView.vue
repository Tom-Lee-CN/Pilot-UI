<template>
  <pt-container class="showcase-container">
    <pt-aside width="200px" class="showcase-sidebar">
      <h3 class="sidebar-title">Components</h3>
      <pt-scrollbar>
        <ul>
          <li
            v-for="component in components"
            :key="component.name"
            :class="{ 'is-active': activeComponent === component.name }"
            @click="activeComponent = component.name"
          >
            {{ component.label }}
          </li>
        </ul>
      </pt-scrollbar>
    </pt-aside>

    <pt-main class="showcase-main">
      <pt-scrollbar id="main-scroll-area">
        <component :is="activeComponent + 'Demo'"></component>
      </pt-scrollbar>
    </pt-main>
  </pt-container>
</template>

<script>
import { defineAsyncComponent } from 'vue';

const demos = {
  AlertDemo: defineAsyncComponent(() => import('./preview/alertDemo.vue')),
  BacktopDemo: defineAsyncComponent(() => import('./preview/backtopDemo.vue')),
  BreadcrumbDemo: defineAsyncComponent(() => import('./preview/breadcrumbDemo.vue')),
  ButtonDemo: defineAsyncComponent(() => import('./preview/buttonDemo.vue')),
  CardDemo: defineAsyncComponent(() => import('./preview/cardDemo.vue')),
  ColDemo: defineAsyncComponent(() => import('./preview/colDemo.vue')),
  ContainerDemo: defineAsyncComponent(() => import('./preview/containerDemo.vue')),
  DrawerDemo: defineAsyncComponent(() => import('./preview/drawerDemo.vue')),
  IconDemo: defineAsyncComponent(() => import('./preview/iconDemo.vue')),
  InfinitescrollDemo: defineAsyncComponent(() => import('./preview/infinitescrollDemo.vue')),
  InputDemo: defineAsyncComponent(() => import('./preview/inputDemo.vue')),
  LinkDemo: defineAsyncComponent(() => import('./preview/linkDemo.vue')),
  LoadingDemo: defineAsyncComponent(() => import('./preview/loadingDemo.vue')),
  ModalDemo: defineAsyncComponent(() => import('./preview/modalDemo.vue')),
  RadioDemo: defineAsyncComponent(() => import('./preview/radioDemo.vue')),
  RadiogroupDemo: defineAsyncComponent(() => import('./preview/radiogroupDemo.vue')),
  RowDemo: defineAsyncComponent(() => import('./preview/rowDemo.vue')),
  ScrollbarDemo: defineAsyncComponent(() => import('./preview/scrollbarDemo.vue')),
  SelectDemo: defineAsyncComponent(() => import('./preview/selectDemo.vue')),
  StepsDemo: defineAsyncComponent(() => import('./preview/stepsDemo.vue')),
  SwitchDemo: defineAsyncComponent(() => import('./preview/switchDemo.vue')),
  TabpaneDemo: defineAsyncComponent(() => import('./preview/tabpaneDemo.vue')),
  TabsDemo: defineAsyncComponent(() => import('./preview/tabsDemo.vue')),
  TextareaDemo: defineAsyncComponent(() => import('./preview/textareaDemo.vue')),
  MessageDemo: defineAsyncComponent(() => import('./preview/messageDemo.vue')),
  CheckboxDemo: defineAsyncComponent(() => import('./preview/checkboxDemo.vue')),
  DropdownDemo: defineAsyncComponent(() => import('./preview/dropdownDemo.vue')),
};

export default {
  name: 'PreviewView',
  components: {
    ...demos,
  },
  data() {
    return {
      activeComponent: 'Button',
      components: [
        { name: 'Dropdown', label: 'Dropdown' },
        { name: 'Checkbox', label: 'Checkbox' },
        { name: 'Alert', label: 'Alert' },
        { name: 'Backtop', label: 'Backtop' },
        { name: 'Breadcrumb', label: 'Breadcrumb' },
        { name: 'Button', label: 'Button' },
        { name: 'Card', label: 'Card' },
        { name: 'Col', label: 'Col' },
        { name: 'Container', label: 'Container' },
        { name: 'Drawer', label: 'Drawer' },
        { name: 'Icon', label: 'Icon' },
        { name: 'Infinitescroll', label: 'InfiniteScroll' },
        { name: 'Input', label: 'Input' },
        { name: 'Link', label: 'Link' },
        { name: 'Loading', label: 'Loading' },
        { name: 'Modal', label: 'Modal' },
        { name: 'Radio', label: 'Radio' },
        { name: 'Radiogroup', label: 'RadioGroup' },
        { name: 'Row', label: 'Row' },
        { name: 'Scrollbar', label: 'Scrollbar' },
        { name: 'Select', label: 'Select' },
        { name: 'Steps', label: 'Steps' },
        { name: 'Switch', label: 'Switch' },
        { name: 'Tabpane', label: 'TabPane' },
        { name: 'Tabs', label: 'Tabs' },
        { name: 'Textarea', label: 'Textarea' },
        { name: 'Message', label: 'Message' },
      ],
    };
  },
};
</script>

<style scoped>
.showcase-container {
  height: 100vh;
}

.showcase-sidebar {
  background-color: #f5f7fa;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  padding: 10px 15px;
  margin: 0;
}

.showcase-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.showcase-sidebar li {
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.showcase-sidebar li:hover {
  background-color: #ecf5ff;
}

.showcase-sidebar li.is-active {
  background-color: #409eff;
  color: white;
  font-weight: 600;
}

.showcase-main {
  background-color: #ffffff;
  height: 100%;
  padding: 0; /* 新增：移除内边距，防止内容溢出 */
  overflow-x: hidden; /* 新增：强制隐藏横向滚动条 */
}
</style>
