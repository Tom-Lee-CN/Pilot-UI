<template>
  <div
    class="pilot-switch"
    :class="{ 'is-checked': modelValue, 'is-disabled': disabled }"
    @click="handleClick"
  >
    <span class="pilot-switch__core" :style="coreStyle">
      <span class="pilot-switch__action"></span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'PilotSwitch',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    activeColor: {
      type: String,
      default: '',
    },
    inactiveColor: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'change'],
  computed: {
    coreStyle() {
      let newColor = this.modelValue ? this.activeColor : this.inactiveColor;
      return {
        backgroundColor: newColor,
      };
    },
  },
  methods: {
    handleClick() {
      if (this.disabled) {
        return;
      }
      const newValue = !this.modelValue;
      this.$emit('update:modelValue', newValue);
      this.$emit('change', newValue);
    },
  },
};
</script>
<style lang="scss" scoped>
@use '../../../styles/variables.scss';
.pilot-switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-size: $font-size-base;
  line-height: $switch-height;
  height: $switch-height;
  vertical-align: middle;
  cursor: pointer;

  &.is-disabled {
    cursor: not-allowed;
    opacity: $switch-disabled-opacity;
  }

  &__core {
    margin: 0;
    position: relative;
    width: $switch-width;
    height: $switch-height;
    border: 1px solid $border-color;
    outline: none;
    border-radius: $switch-border-radius;
    box-sizing: border-box;
    background: $switch-off-color;
    transition:
      border-color 0.3s,
      background-color 0.3s;
    vertical-align: middle;

    .pilot-switch__action {
      position: absolute;
      top: $switch-action-offset;
      left: $switch-action-offset;
      border-radius: 100%;
      transition: all 0.3s;
      width: $switch-action-size;
      height: $switch-action-size;
      background-color: $switch-action-bg;
    }
  }

  &.is-checked {
    .pilot-switch__core {
      border-color: $switch-on-color;
      background-color: $switch-on-color;

      .pilot-switch__action {
        left: 100%;
        margin-left: -#{$switch-action-size + $switch-action-offset};
      }
    }
  }
}
</style>
