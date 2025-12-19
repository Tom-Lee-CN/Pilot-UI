<template>
  <a
    :class="[
      'pilot-link',
      type ? `pilot-link--${type}` : '',
      disabled && 'is-disabled',
      underline && !disabled && 'is-underline',
    ]"
    :href="disabled ? null : href"
    @click="handleClick"
  >
    <i v-if="icon" :class="icon"></i>
    <span v-if="$slots.default" class="pilot-link--inner">
      <slot></slot>
    </span>
  </a>
</template>

<script>
export default {
  name: 'PilotLink',
  props: {
    type: {
      type: String,
      default: 'default',
      validator: (val) =>
        ['default', 'primary', 'success', 'warning', 'info', 'danger'].includes(val),
    },
    underline: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    href: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleClick(event) {
      if (this.disabled) {
        event.preventDefault();
      }
      this.$emit('click', event);
    },
  },
};
</script>

<style lang="scss">
.pilot-link {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  position: relative;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  font-size: var(--pilot-link-font-size, 14px);
  font-weight: var(--pilot-link-font-weight, 500);

  &--inner {
    margin-left: 4px;
  }

  &.is-underline:hover:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 0;
    bottom: 0;
    border-bottom: 1px solid;
  }

  &.is-disabled {
    cursor: not-allowed;
    color: var(--pilot-link-disabled-text-color, #c0c4cc);
  }

  &--default {
    color: var(--pilot-link-default-text-color, #606266);
    &:hover {
      color: var(--pilot-link-default-hover-text-color, #409eff);
    }
  }

  &--primary {
    color: var(--pilot-color-primary, #409eff);
    &:hover {
      opacity: 0.8;
    }
  }

  &--success {
    color: var(--pilot-color-success, #67c23a);
    &:hover {
      opacity: 0.8;
    }
  }

  &--warning {
    color: var(--pilot-color-warning, #e6a23c);
    &:hover {
      opacity: 0.8;
    }
  }

  &--info {
    color: var(--pilot-color-info, #909399);
    &:hover {
      opacity: 0.8;
    }
  }

  &--danger {
    color: var(--pilot-color-danger, #f56c6c);
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
