<template>
  <aside class="pilot-aside" :style="{ width }" :class="{ 'is-fixed': fixed }">
    <slot></slot>
  </aside>
</template>

<script>
export default {
  name: 'PilotAside',
  props: {
    /**
     * @description 侧边栏宽度
     * @type {String}
     */
    width: {
      type: String,
      default: '300px',
    },
    /**
     * @description 是否固定在左侧
     * @type {Boolean}
     */
    fixed: {
      type: Boolean,
      default: false,
    },
    /**
     * @description 距离顶部的偏移量，当 Header 也固定时使用
     * @type {String}
     */
    offsetTop: {
      type: String,
      default: '0px',
    },
  },
  computed: {
    style() {
      const style = {
        width: this.width,
      };
      if (this.fixed) {
        style.top = this.offsetTop;
      }
      return style;
    },
  },
};
</script>

<style lang="scss">
.pilot-aside {
  overflow: auto;
  box-sizing: border-box;
  flex-shrink: 0;
  overflow: hidden;
  &.is-fixed {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 999;
  }
}
</style>
