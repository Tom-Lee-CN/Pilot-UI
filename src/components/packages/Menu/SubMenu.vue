<template>
  <!-- 子菜单 li -->
  <li class="pilot-sub-menu">
    <!-- 子菜单标题区域，支持点击和鼠标悬停展开/收起 -->
    <div
      class="pilot-sub-menu__title"
      @click="handleClick"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
    >
      <span>{{ title }}</span>
      <i class="pilot-sub-menu__arrow"></i>
    </div>
    <!-- 子菜单内容，使用过渡动画 -->
    <transition name="menu-collapse">
      <ul v-show="isOpen" class="pilot-menu pilot-menu--popup">
        <slot></slot>
      </ul>
    </transition>
  </li>
</template>

<script>
// 导出子菜单组件
export default {
  name: 'PilotSubMenu',
  // 注入父级菜单实例
  inject: ['rootMenu'],
  props: {
    // 子菜单唯一标识
    index: String,
    // 子菜单标题
    title: String,
  },
  data() {
    return {
      // 子菜单是否展开
      isOpen: false,
    };
  },
  methods: {
    // 垂直模式下点击展开/收起
    handleClick() {
      if (this.rootMenu.mode === 'vertical') {
        this.isOpen = !this.isOpen;
        this.rootMenu.handleSubMenuClick(this.index, this.isOpen);
      }
    },
    // 水平模式下鼠标移入展开
    handleMouseenter() {
      if (this.rootMenu.mode === 'horizontal') {
        this.isOpen = true;
      }
    },
    // 水平模式下鼠标移出收起
    handleMouseleave() {
      if (this.rootMenu.mode === 'horizontal') {
        this.isOpen = false;
      }
    },
  },
};
</script>
