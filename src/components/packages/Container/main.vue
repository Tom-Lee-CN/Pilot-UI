<template>
  <main class="pilot-main" :style="style">
    <slot></slot>
  </main>
</template>

<script>
export default {
  name: 'PilotMain',
  props: {
    paddingTop: {
      type: String,
      default: '0px',
    },
    paddingLeft: {
      type: String,
      default: '0px',
    },
    paddingBottom: {
      type: String,
      default: '0px',
    },
  },
  computed: {
    style() {
      return {
        paddingTop: this.paddingTop,
        paddingLeft: this.paddingLeft,
        paddingBottom: this.paddingBottom,
      };
    },
  },
};
</script>

<style lang="scss">
.pilot-main {
  overflow: auto;
  box-sizing: border-box;
  flex: 1;
  overflow: auto;
}
</style>
