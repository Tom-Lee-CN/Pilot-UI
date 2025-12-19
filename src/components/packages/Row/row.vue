<template>
  <component :is="tag" :class="rowKls" :style="style">
    <slot></slot>
  </component>
</template>
<script>
export default {
  name: 'PilotRow',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    // 栅格间隔
    gutter: {
      type: Number,
      default: 0,
    },
    justify: {
      type: String,
      default: 'start', // 'start', 'end', 'center', 'space-around', 'space-between'
    },
    align: {
      type: String,
      default: 'top', // 'top', 'middle', 'bottom'
    },
  },
  provide() {
    return {
      gutter: this.gutter,
    };
  },
  computed: {
    style() {
      const ret = {};
      if (this.gutter) {
        ret.marginLeft = `-${this.gutter / 2}px`;
        ret.marginRight = ret.marginLeft;
      }
      return ret;
    },
    rowKls() {
      return [
        'pilot-row',
        this.justify !== 'start' ? `pilot-row--justify-${this.justify}` : '',
        this.align !== 'top' ? `pilot-row--align-${this.align}` : '',
      ];
    },
  },
};
</script>
<style scoped lang="scss">
.pilot-row {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  box-sizing: border-box;

  &--justify-start {
    justify-content: flex-start;
  }
  &--justify-end {
    justify-content: flex-end;
  }
  &--justify-center {
    justify-content: center;
  }
  &--justify-space-around {
    justify-content: space-around;
  }
  &--justify-space-between {
    justify-content: space-between;
  }

  &--align-top {
    align-items: flex-start;
  }
  &--align-middle {
    align-items: center;
  }
  &--align-bottom {
    align-items: flex-end;
  }
}
</style>
