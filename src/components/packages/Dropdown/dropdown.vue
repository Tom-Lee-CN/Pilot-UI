<template>
  <!-- 
    Dropdown 组件的根元素。
    - 使用 ref="dropdown" 以便在脚本中引用此 DOM 元素。
    - 监听 mouseenter 和 mouseleave 事件，用于实现悬停触发。
  -->
  <div
    class="pt-dropdown"
    ref="dropdown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 
      触发下拉菜单的区域。
      - 监听 click 事件，用于实现点击触发。
      - <slot name="trigger"> 允许父组件自定义触发内容，例如一个按钮或链接。
    -->
    <div @click="handleClick">
      <slot name="trigger"></slot>
    </div>

    <!-- 
      下拉菜单的过渡效果。
      - 使用 Vue 的 <transition> 组件，名为 "fade"，实现淡入淡出效果。
    -->
    <transition name="fade">
      <!-- 
        下拉菜单的容器。
        - v-if="visible" 控制菜单的显示与隐藏。
        - <slot> 默认插槽，用于接收 <pt-dropdown-item> 组件。
      -->
      <div v-if="visible" class="pt-dropdown-menu">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  // 组件名称，遵循项目规范，用于全局注册为 <pt-dropdown>
  name: 'PilotDropdown',
  props: {
    // 触发方式，'click' 或 'hover'
    trigger: {
      type: String,
      default: 'click',
    },
    // 点击菜单项后是否隐藏菜单
    hideOnClick: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // 控制下拉菜单是否可见
      visible: false,
    };
  },
  // 使用 provide 向后代组件 (pt-dropdown-item) 注入 dropdown 实例，
  // 以便子组件可以调用父组件的方法。
  provide() {
    return {
      dropdown: this,
    };
  },
  methods: {
    // 处理点击触发区域的事件
    handleClick() {
      // 仅当触发方式为 'click' 时，切换菜单的可见状态
      if (this.trigger === 'click') {
        this.visible = !this.visible;
      }
    },
    // 处理鼠标移入事件
    handleMouseEnter() {
      // 仅当触发方式为 'hover' 时，显示菜单
      if (this.trigger === 'hover') {
        this.visible = true;
      }
    },
    // 处理鼠标移出事件
    handleMouseLeave() {
      // 仅当触发方式为 'hover' 时，隐藏菜单
      if (this.trigger === 'hover') {
        this.visible = false;
      }
    },
    // 处理点击组件外部区域的事件，用于在点击外部时关闭菜单
    handleClickOutside(event) {
      // 仅当触发方式为 'click' 且菜单是可见状态时，
      // 判断点击事件的目标是否在 dropdown 组件内部。
      if (
        this.trigger === 'click' &&
        this.visible &&
        this.$refs.dropdown &&
        !this.$refs.dropdown.contains(event.target)
      ) {
        // 如果点击在外部，则隐藏菜单
        this.visible = false;
      }
    },
    // 由子组件 (pt-dropdown-item) 调用的方法
    handleMenuItemClick(command) {
      // 如果设置为 true，则在点击菜单项后隐藏菜单
      if (this.hideOnClick) {
        this.visible = false;
      }
      // 触发 command 事件，并向父组件传递 command 值
      this.$emit('command', command);
    },
  },
  // 组件挂载后，在 document 上添加全局点击事件监听
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  // 组件卸载前，移除全局点击事件监听，防止内存泄漏
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>

<style scoped>
/* 下拉组件的根容器样式 */
.pt-dropdown {
  position: relative;
  display: inline-block;
}

.pt-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-width: 100%;
  /* 新增：设置变换的原点为顶部中心 */
  transform-origin: top center;
}

/* 定义过渡效果的激活状态 */
.fade-enter-active,
.fade-leave-active {
  /* 修改：同时对 opacity 和 transform 进行过渡 */
  transition:
    opacity 0.2s ease,
    transform 0.3s ease;
}

/* 定义进入过渡的起始状态和离开过渡的结束状态 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  /* 新增：在垂直方向上缩放为0，实现展开效果 */
  transform: scaleY(0);
}
</style>
