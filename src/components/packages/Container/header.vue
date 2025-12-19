<template>
  <header class="pilot-header" :style="{ height }" :class="{ 'is-fixed': fixed }">
    <slot></slot>
  </header>
</template>

<script>
export default {
  name: 'PilotHeader',
  props: {
    /**
     * @description 顶栏高度
     * @type {String}
     */
    height: {
      type: String,
      default: '60px',
    },
    /**
     * @description 是否固定在顶部
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
.pilot-header {
  padding: 0 20px;
  box-sizing: border-box;
  flex-shrink: 0;
}
.pilot-header {
  padding: 0 20px;
  box-sizing: border-box;
  flex-shrink: 0;

  &.is-fixed {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
  }
}
</style>
