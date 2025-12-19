<template>
  <section class="pilot-container" :class="{ 'is-vertical': isVertical, 'is-reverse': reverse }">
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'PilotContainer',
  props: {
    /**
     * @description 布局方向
     * @type {String}
     * @enum {'horizontal', 'vertical'}
     */
    direction: {
      type: String,
      validator: (val) => ['horizontal', 'vertical'].includes(val),
    },
    /**
     * @description 是否反转水平布局下子元素的顺序
     * @type {Boolean}
     */
    reverse: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    /**
     * @description 判断是否为垂直布局
     * 如果 props.direction 被显式设置为 'vertical'，则为垂直布局。
     * 如果 props.direction 未设置，则检查子元素中是否包含 <pilot-header> 或 <pilot-footer>，
     * 如果包含，则自动识别为垂直布局。
     */
    isVertical() {
      if (this.direction === 'vertical') {
        return true;
      }
      if (this.direction === 'horizontal') {
        return false;
      }
      // 在 Vue 3 中，this.$slots.default() 返回一个包含子节点 VNode 的数组
      if (this.$slots && this.$slots.default) {
        const vNodes = this.$slots.default();
        return vNodes.some((vNode) => {
          // 获取 VNode 的组件名
          const tag = vNode.type && vNode.type.name;
          return tag === 'PilotHeader' || tag === 'PilotFooter';
        });
      }
      return false;
    },
  },
};
</script>

<style lang="scss">
.pilot-container {
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  min-width: 0;

  &.is-vertical {
    flex-direction: column;
  }
  &.is-reverse {
    flex-direction: row-reverse;
  }
}
</style>
