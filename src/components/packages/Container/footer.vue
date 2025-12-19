<template>
  <footer class="pilot-footer" :style="{ height }" :class="{ 'is-fixed': fixed }">
    <slot></slot>
  </footer>
</template>

<script>
export default {
  name: 'PilotFooter',
  props: {
    /**
     * @description 底栏高度
     * @type {String}
     */
    height: {
      type: String,
      default: '60px',
    },
    /**
     * @description 是否固定在底部
     * @type {Boolean}
     */
    fixed: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.pilot-footer {
  padding: 0 20px;
  box-sizing: border-box;
  flex-shrink: 0;

  &.is-fixed {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 1000;
  }
}
</style>
