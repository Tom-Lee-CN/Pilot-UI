<template>
  <i class="pilot-icon" :style="style">
    <component :is="icon" />
  </i>
</template>
<script>
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
export default {
  name: 'PilotIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [String, Number],
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
  },
  computed: {
    icon() {
      const iconName = this.name.replace(/-(\w)/g, (_, c) => c.toUpperCase());
      const capitalizedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
      return ElementPlusIconsVue[capitalizedIconName];
    },
    style() {
      const styles = {};
      if (this.size) {
        styles['font-size'] = typeof this.size === 'number' ? `${this.size}px` : this.size;
      }
      if (this.color) {
        styles['color'] = this.color;
      }
      return styles;
    },
  },
};
</script>
<style scoped lang="scss">
.pilot-icon {
  height: 1em;
  width: 1em;
  line-height: 1em;
  margin: 0 auto;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  fill: currentColor;
  font-size: 1rem;
  color: var(--pilot-icon-color, inherit);
}
.pilot-icon :deep(svg) {
  height: 100%;
  width: 100%;
}
</style>
