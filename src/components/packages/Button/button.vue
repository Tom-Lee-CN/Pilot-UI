<template>
  <button :class="buttonClass" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'PilotButton',
  props: {
    type: {
      type: String,
      default: 'primary',
      validator: (value) => {
        return ['primary', 'success', 'danger', 'warning', 'info'].includes(value);
      },
    },
    size: {
      type: String,
      default: 'default',
      validator: (value) => {
        return ['default', 'large', 'small'].includes(value);
      },
    },
    plain: {
      type: Boolean,
      default: false,
    },
    round: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonClass() {
      return [
        'pilot-button',
        `pilot-button--${this.type}`,
        `pilot-button--${this.size}`,
        { 'is-plain': this.plain, 'is-round': this.round, 'is-disabled': this.disabled },
      ];
    },
  },
};
</script>

<style scoped lang="scss">
@use '../../../styles/mixins.scss' as *;
@use 'sass:color';

.pilot-button {
  // --- Reset & Basic Layout ---
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: var(--pilot-color-white);
  border: 1px solid var(--pilot-border-color);
  color: var(--pilot-text-color-regular);
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0 5px 10px 5px;
  transition: 0.1s;
  font-weight: 500;
  user-select: none;
  padding: var(--pilot-button-padding-y-default) var(--pilot-button-padding-x-default);
  font-size: var(--pilot-font-size-base);
  border-radius: var(--pilot-button-border-radius-default);
  // &:hover,
  // &:focus {
  //   color: var(--pilot-color-primary);
  //   border-color: var(--pilot-color-primary);
  //   background-color: color.mix($color-white, $primary-color, 90%);
  // }

  // &:active {
  //   color: color.scale($primary-color, $lightness: -10%);
  //   border-color: color.scale($primary-color, $lightness: -10%);
  //   outline: none;
  // }

  // --- Type Variations ---
  &--primary {
    @include button-variant($primary-color);
  }
  &--success {
    @include button-variant($success-color);
  }
  &--warning {
    @include button-variant($warning-color);
  }
  &--danger {
    @include button-variant($danger-color);
  }
  &--info {
    @include button-variant($info-color);
  }

  // --- Size Variations ---
  &--large {
    padding: var(--pilot-button-padding-y-large) var(--pilot-button-padding-x-large);
    font-size: var(--pilot-font-size-medium);
  }
  &--small {
    padding: var(--pilot-button-padding-y-small) var(--pilot-button-padding-x-small);
    font-size: var(--pilot-font-size-extra-small);
  }

  // --- Plain, Round, Circle Variations ---
  &.is-plain {
    &:hover,
    &:focus {
      background: var(--pilot-color-white);
      border-color: var(--pilot-color-primary);
      color: var(--pilot-color-primary);
    }
    &:active {
      background: var(--pilot-color-white);
      border-color: color.scale($primary-color, $lightness: -10%);
      color: color.scale($primary-color, $lightness: -10%);
      outline: none;
    }
  }

  &.is-round {
    border-radius: var(--pilot-button-border-radius-round);
  }

  &.is-circle {
    border-radius: 50%;
    padding: var(--pilot-button-padding-y-default);
  }

  // --- Disabled State ---
  &.is-disabled {
    &,
    &:hover,
    &:focus {
      color: var(--pilot-text-color-placeholder);
      cursor: not-allowed;
      background-image: none;
      background-color: var(--pilot-color-white);
      border-color: var(--pilot-border-color-light);
    }
  }
}
</style>
