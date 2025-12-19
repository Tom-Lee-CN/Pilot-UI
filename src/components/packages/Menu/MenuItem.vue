<template>
  <!-- 菜单项 li，根据激活和禁用状态动态设置 class -->
  <li
    class="pilot-menu-item"
    :class="{
      'is-active': active,
      'is-disabled': disabled,
    }"
    @click="handleClick"
  >
    <span class="pilot-menu-item__content">
      <!-- 可选图标插槽 -->
      <i v-if="icon" class="pilot-menu-item__icon">
        <component :is="icon" />
      </i>
      <!-- 默认插槽，显示菜单内容 -->
      <slot></slot>
    </span>
  </li>
</template>

<script>
// 导出菜单项组件
export default {
  name: 'PilotMenuItem',
  // 注入父级菜单实例
  inject: ['rootMenu'],
  props: {
    // 菜单项唯一标识
    index: {
      type: String,
      required: true,
    },
    // 是否禁用
    disabled: Boolean,
    // 可选图标
    icon: [String, Object],
  },
  computed: {
    // 判断当前菜单项是否激活
    active() {
      return this.rootMenu.activeIndex === this.index;
    },
  },
  methods: {
    // 菜单项点击事件
    handleClick() {
      if (!this.disabled) {
        // 设置父菜单的激活项
        this.rootMenu.activeIndex = this.index;
        // 触发 click 事件
        this.$emit('click', this.index);
      }
    },
  },
};
</script>

<style lang="scss">
.pilot-menu-item {
  padding: 0 20px;
  height: 56px;
  line-height: 56px;
  font-size: 14px;
  color: var(--pilot-menu-text-color, #303133);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  display: flex;
  align-items: center;
  list-style: none;

  // 鼠标悬停样式
  &:hover {
    background-color: var(--pilot-menu-hover-bg-color, #f5f7fa);
  }

  // 激活状态样式
  &.is-active {
    color: var(--pilot-menu-active-text-color, #409eff);
    background-color: var(--pilot-menu-active-bg-color, #ecf5ff);
  }

  // 禁用状态样式
  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // 内容区域样式
  &__content {
    display: flex;
    align-items: center;
    width: 100%;
  }

  // 图标样式
  &__icon {
    margin-right: 8px;
    display: flex;
    align-items: center;
  }
}
</style>
