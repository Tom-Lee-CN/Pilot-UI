<template>
  <div class="pilot-tabs">
    <div class="pilot-tabs__header">
      <div
        v-for="pane in panes"
        :key="pane.props.name"
        class="pilot-tabs__item"
        :class="{ 'is-active': pane.props.name === modelValue }"
        @click="handleTabClick(pane.props.name)"
      >
        {{ pane.props.label }}
      </div>
    </div>
    <div class="pilot-tabs__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PilotTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
  },
  emits: ['update:modelValue', 'tab-click'],
  provide() {
    return {
      rootTabs: this,
    };
  },
  computed: {
    panes() {
      if (this.$slots.default) {
        return this.$slots
          .default()
          .filter((node) => node.type && node.type.name === 'PilotTabPane');
      }
      return [];
    },
  },
  methods: {
    handleTabClick(name) {
      this.$emit('update:modelValue', name);
      this.$emit('tab-click', name);
    },
  },
};
</script>

<style lang="scss">
@use '../../../styles/variables.scss';

.pilot-tabs {
  .pilot-tabs__header {
    display: flex;
    align-items: center;
    height: var(--pilot-tabs-header-height);
    padding: var(--pilot-tabs-header-padding);
    background-color: var(--pilot-tabs-header-bg-color);
    border-bottom: 1px solid var(--pilot-tabs-border-color);
    position: relative;
  }

  .pilot-tabs__nav {
    display: flex;
  }

  .pilot-tabs__item {
    padding: 0 20px;
    height: var(--pilot-tabs-header-height);
    line-height: var(--pilot-tabs-header-height);
    font-size: var(--pilot-tabs-font-size);
    color: var(--pilot-tabs-text-color);
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: var(--pilot-tabs-hover-text-color);
    }

    &.is-active {
      color: var(--pilot-tabs-active-text-color);
    }
  }

  .pilot-tabs__active-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: var(--pilot-tabs-active-bar-height);
    background-color: var(--pilot-tabs-active-text-color);
    transition: all 0.3s;
  }

  .pilot-tabs__content {
    padding: 20px;
  }
}
</style>
