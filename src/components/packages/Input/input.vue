<template>
  <div class="pilot-input" :class="inputClasses">
    <input
      ref="inputRef"
      class="pilot-input__inner"
      :value="modelValue"
      :type="inputType"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      @input="handleInput"
    />
    <div
      v-if="showClear || showPasswordToggle || (showWordLimit && maxlength)"
      class="pilot-input__suffix"
    >
      <!-- 清空图标 -->
      <pilot-icon
        v-if="showClear"
        class="pilot-input__icon"
        name="circle-close"
        @click="handleClear"
      />
      <!-- 密码可见性图标 -->
      <pilot-icon
        v-if="showPasswordToggle"
        class="pilot-input__icon"
        :name="passwordIconName"
        @click="togglePasswordVisibility"
      />
      <span v-if="showWordLimit && maxlength" class="pilot-input__count">
        {{ textLength }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PilotInput',
  components: {},
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否开启清除按钮
    clearable: {
      type: Boolean,
      default: false,
    },
    // 是否显示密码可见性图标
    showPassword: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: [Number, String],
    },
    showWordLimit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      passwordVisible: false,
    };
  },
  emits: ['update:modelValue'],
  computed: {
    inputClasses() {
      return {
        'is-disabled': this.disabled,
        'pilot-input--suffix':
          this.showClear || this.showPasswordToggle || (this.showWordLimit && this.maxlength),
      };
    },
    // 是否显示后缀容器
    isSuffixVisible() {
      return this.clearable || this.showPassword;
    },
    // 密码可见性图标名称
    showClear() {
      return this.clearable && !this.disabled && this.modelValue !== '' && this.modelValue !== null;
    },
    // 是否显示密码切换图标
    showPasswordToggle() {
      return this.showPassword && !this.disabled && this.type === 'password';
    },
    // 动态计算 input 的 type
    inputType() {
      if (this.type === 'password' && this.passwordVisible) {
        return 'text';
      }
      return this.type;
    },
    // 动态计算密码图标的名称
    passwordIconName() {
      return this.passwordVisible ? 'view' : 'hide';
    },
    // 计算文本长度
    textLength() {
      return this.modelValue?.length || 0;
    },
  },
  methods: {
    // 处理输入事件
    handleInput(event) {
      this.$emit('update:modelValue', event.target.value);
    },
    // 清空输入框
    handleClear() {
      this.$emit('update:modelValue', '');
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      });
    },
    // 切换密码可见性
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.pilot-input {
  position: relative;
  font-size: $input-font-size;
  display: inline-block;
  width: 100%;

  &.is-disabled .pilot-input__inner {
    background-color: $input-disabled-bg;
    border-color: $input-disabled-border;
    color: $input-disabled-color;
    cursor: not-allowed;
  }

  &.pilot-input--suffix .pilot-input__inner {
    padding-right: 30px;
  }
}
.pilot-input__inner {
  -webkit-appearance: none;
  background-color: $color-white;
  background-image: none;
  border-radius: $input-border-radius;
  border: $border-width-base solid $border-color;
  box-sizing: border-box;
  color: $input-color;
  display: inline-block;
  font-size: inherit;
  height: $input-height;
  line-height: $input-height;
  outline: none;
  padding: 0 $input-padding-x;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;

  &:focus {
    outline: none;
    border-color: $input-focus-border-color;
  }

  &::placeholder {
    color: $input-placeholder-color;
  }
}

.pilot-input__suffix {
  position: absolute;
  right: 10px;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  color: $input-suffix-icon-color;
  cursor: pointer;
  transition: color 0.2s;
  gap: 8px; // 为多个图标之间提供间距

  &:hover {
    cursor: pointer;
    transition: color 0.2s;
    &:hover {
      color: $input-suffix-icon-hover-color;
    }
  }
  .pilot-input__count {
    color: $text-color-secondary;
    font-size: $font-size-extra-small;
    white-space: nowrap;
  }
  // 如果同时显示两个图标，需要更大的右边距
  .pilot-input--suffix.show-both .pilot-input__inner {
    padding-right: 58px;
  }
}
</style>
