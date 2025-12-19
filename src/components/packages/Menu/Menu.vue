<template>
  <!-- 菜单容器，根据模式和折叠状态动态设置 class -->
  <ul class="pilot-menu" :class="[`pilot-menu--${mode}`, { 'pilot-menu--collapse': isCollapse }]">
    <!-- 插槽，渲染菜单项和子菜单 -->
    <slot></slot>
  </ul>
</template>

<script>
// 导出菜单主组件
export default {
  name: 'PilotMenu',
  // 通过 provide 向后代组件注入 rootMenu 实例
  provide() {
    return {
      rootMenu: this,
    };
  },
  props: {
    // 菜单模式：horizontal 水平，vertical 垂直
    mode: {
      type: String,
      default: 'vertical',
      validator: (value) => ['horizontal', 'vertical'].includes(value),
    },
    // 默认激活的菜单项 index
    defaultActive: String,
    // 是否折叠菜单
    collapse: Boolean,
  },
  data() {
    return {
      // 当前激活的菜单项 index
      activeIndex: this.defaultActive || '',
      // 当前菜单是否折叠
      isCollapse: this.collapse,
      // 已打开的子菜单 index 列表
      openedMenus: [],
    };
  },
  methods: {
    // 处理子菜单点击，管理打开/关闭状态
    handleSubMenuClick(index, isOpen) {
      if (isOpen) {
        this.openedMenus.push(index);
      } else {
        const i = this.openedMenus.indexOf(index);
        if (i !== -1) {
          this.openedMenus.splice(i, 1);
        }
      }
    },
  },
  watch: {
    // 监听 collapse 属性变化，同步到 isCollapse
    collapse(newVal) {
      this.isCollapse = newVal;
    },
  },
};
</script>

<style lang="scss">
.pilot-menu {
  position: relative;
  background-color: var(--pilot-menu-bg-color, #ffffff);
  color: var(--pilot-menu-text-color, #303133);
  border-right: 1px solid var(--pilot-menu-border-color, #e6e6e6);
  transition: all 0.3s ease;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  list-style: none;

  // 水平模式样式
  &--horizontal {
    display: flex;
    align-items: center;
    border-right: none;
    border-bottom: 1px solid var(--pilot-menu-border-color, #e6e6e6);
    height: auto;
    padding: 0 10px;
  }

  // 垂直模式样式
  &--vertical {
    width: var(--pilot-menu-width, 220px);
  }

  // 折叠菜单样式
  &--collapse {
    width: var(--pilot-menu-collapse-width, 64px);
    transition: width 0.3s ease;

    .pilot-menu-item,
    .pilot-sub-menu__title {
      padding: 0 20px;
      text-align: center;
    }
  }
}
</style>
