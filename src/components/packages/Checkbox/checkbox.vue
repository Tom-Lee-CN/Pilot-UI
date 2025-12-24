<template>
  <label
    class="pilot-checkbox"
    :class="{
      'is-checked': isChecked,
      'is-disabled': isDisabled,
    }"
  >
    <span class="pilot-checkbox__input">
      <span class="pilot-checkbox__inner"></span>
      <input
        type="checkbox"
        class="pilot-checkbox__original"
        :name="name"
        :value="label"
        :checked="isChecked"
        :disabled="isDisabled"
        @change="handleChange"
      />
    </span>
    <span class="pilot-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
export default {
  name: 'PilotCheckbox',
  props: {
    modelValue: {
      type: [Boolean, Array],
      default: false,
    },
    label: {
      type: [String, Number, Boolean],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'change'],
  // 1. 使用 inject 选项来注入来自父组件 CheckboxGroup 的依赖
  inject: {
    checkboxGroup: {
      default: null, // 如果不在 CheckboxGroup 内，则默认为 null
    },
  },
  // 2. 使用 computed 选项来定义计算属性
  computed: {
    isGroup() {
      return !!this.checkboxGroup;
    },
    isChecked: {
      get() {
        if (this.isGroup) {
          // 在组内，检查自己的 label 是否在组的 modelValue 数组中
          return this.checkboxGroup.modelValue.includes(this.label);
        }
        // 不在组内，直接使用 v-model 绑定的布尔值
        return this.modelValue;
      },
      set(newValue) {
        if (this.isGroup) {
          const groupValue = [...this.checkboxGroup.modelValue];
          if (newValue) {
            if (!groupValue.includes(this.label)) {
              groupValue.push(this.label);
            }
          } else {
            const index = groupValue.indexOf(this.label);
            if (index > -1) {
              groupValue.splice(index, 1);
            }
          }
          this.checkboxGroup.handleChange(groupValue);
        } else {
          this.$emit('update:modelValue', newValue);
          this.$emit('change', newValue);
        }
      },
    },
    isDisabled() {
      // 禁用状态也可能由父级 CheckboxGroup 控制
      return this.disabled || (this.checkboxGroup?.disabled ?? false);
    },
  },
  // 3. 使用 methods 选项来定义方法
  methods: {
    handleChange(event) {
      const checked = event.target.checked;

      if (this.isGroup) {
        // 在组内，需要手动更新组的 modelValue 数组
        const groupValue = new Set(this.checkboxGroup.modelValue.value);
        if (checked) {
          groupValue.add(this.label);
        } else {
          groupValue.delete(this.label);
        }
        // 调用从 CheckboxGroup 注入的 handleChange 方法来更新父组件
        this.checkboxGroup.handleChange(Array.from(groupValue));
      } else {
        // 不在组内，直接触发 update:modelValue 事件来更新 v-model
        this.$emit('update:modelValue', checked);
      }
      // 无论如何，都触发 change 事件
      this.$emit('change', checked);
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../../styles/variables.scss' as *;
.pilot-checkbox {
  color: $text-color-regular;
  font-weight: $font-weight-primary;
  font-size: $font-size-base;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  user-select: none;
  margin-right: 30px;

  &.is-disabled {
    cursor: not-allowed;
    color: $text-color-placeholder;
  }

  .pilot-checkbox__input {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-flex;
    position: relative;

    .pilot-checkbox__inner {
      display: inline-block;
      position: relative;
      border: $border-width-base solid $border-color;
      border-radius: 2px;
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      background-color: $color-white;
      z-index: 1;
      transition:
        border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
        background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);

      &:after {
        box-sizing: content-box;
        content: '';
        border: $border-width-base solid $color-white;
        border-left: 0;
        border-top: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        transform: rotate(45deg) scaleY(0);
        width: 3px;
        transition: transform 0.15s ease-in 0.05s;
        transform-origin: center;
      }
    }

    .pilot-checkbox__original {
      opacity: 0;
      outline: none;
      position: absolute;
      margin: 0;
      width: 0;
      height: 0;
      z-index: -1;
    }
  }

  .pilot-checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 19px;
    font-size: $font-size-base;
  }

  // 选中状态
  &.is-checked {
    .pilot-checkbox__inner {
      background-color: $primary-color;
      border-color: $primary-color;

      &:after {
        transform: rotate(45deg) scaleY(1);
      }
    }
    .pilot-checkbox__label {
      color: $primary-color;
    }
  }

  // 禁用状态
  &.is-disabled {
    .pilot-checkbox__inner {
      background-color: $fill-color-light;
      border-color: $border-color;
    }
  }
}
</style>
