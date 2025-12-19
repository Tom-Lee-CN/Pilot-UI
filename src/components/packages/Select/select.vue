<template>
  <div class="pilot-select" :class="{ 'is-disabled': disabled }" @click="toggleDropdown">
    <div class="pilot-select__input">
      <span :class="{ 'is-placeholder': !selectedLabel }">{{ selectedLabel || placeholder }}</span>
      <pilot-icon
        class="pilot-select__arrow"
        :class="{ 'is-reverse': dropdownVisible }"
        name="arrow-right"
      ></pilot-icon>
    </div>
    <transition name="pilot-select-dropdown">
      <div v-if="dropdownVisible" class="pilot-select__dropdown">
        <ul class="pilot-select__options">
          <li
            v-for="option in options"
            :key="option.value"
            class="pilot-select__option"
            :class="{ 'is-selected': modelValue === option.value }"
            @click.stop="handleOptionClick(option)"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'PilotSelect',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      dropdownVisible: false,
    };
  },
  computed: {
    // 计算选中的选项的标签
    selectedLabel() {
      const selectedOption = this.options.find((option) => option.value === this.modelValue);
      return selectedOption ? selectedOption.label : '';
    },
  },
  methods: {
    toggleDropdown() {
      if (this.disabled) return;
      this.dropdownVisible = !this.dropdownVisible;
    },
    handleOptionClick(option) {
      this.$emit('update:modelValue', option.value);
      this.dropdownVisible = false;
    },
    handleOutsideClick(event) {
      if (!this.$el.contains(event.target)) {
        this.dropdownVisible = false;
      }
    },
  },
  watch: {
    // 侦听下拉框的可见性
    dropdownVisible(isVisible) {
      if (isVisible) {
        // 当下拉框打开时，添加 document 点击事件监听
        document.addEventListener('click', this.handleOutsideClick, true);
      } else {
        // 当下拉框关闭时，移除事件监听
        document.removeEventListener('click', this.handleOutsideClick, true);
      }
    },
  },
  beforeUnmount() {
    // 在组件卸载前，确保移除事件监听，防止内存泄漏
    document.removeEventListener('click', this.handleOutsideClick, true);
  },
};
</script>
<style scoped lang="scss">
.pilot-select {
  position: relative;
  display: inline-block;
  width: 100%;
  cursor: pointer;

  &.is-disabled {
    cursor: not-allowed;
    .pilot-select__input {
      background-color: var(--pilot-select-disabled-bg);
      border-color: var(--pilot-select-disabled-border-color);
      color: var(--pilot-select-disabled-color);
    }
  }
}
.pilot-select__input {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--pilot-select-input-height);
  line-height: var(--pilot-select-input-height);
  padding: 0 var(--pilot-input-padding-x);
  border: 1px solid var(--pilot-select-input-border-color);
  border-radius: var(--pilot-select-input-border-radius);
  background-color: var(--pilot-color-white);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    border-color: var(--pilot-select-input-hover-border-color);
  }

  .is-placeholder {
    color: var(--pilot-select-input-placeholder-color);
  }
}

.pilot-select__arrow {
  margin: 0 0 0 auto;
  transition: transform 0.3s;
  &.is-reverse {
    transform: rotate(90deg);
  }
}
.pilot-select__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  z-index: 10;
  border: 1px solid var(--pilot-select-dropdown-border-color);
  border-radius: var(--pilot-select-input-border-radius);
  background-color: var(--pilot-select-dropdown-bg);
  box-shadow: var(--pilot-select-dropdown-shadow);
}

.pilot-select__options {
  list-style: none;
  padding: var(--pilot-select-dropdown-padding);
  margin: 0;
  max-height: 274px;
  overflow: auto;
}

.pilot-select__option {
  padding: 0 var(--pilot-spacing-base);
  height: var(--pilot-select-option-height);
  line-height: var(--pilot-select-option-height);
  font-size: var(--pilot-select-option-font-size);
  color: var(--pilot-select-option-text-color);
  color: #606266;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: var(--pilot-select-option-hover-bg);
  }

  &.is-selected {
    color: var(--pilot-select-option-selected-color);
    font-weight: var(--pilot-select-option-selected-font-weight);
  }
}

// Dropdown transition
.pilot-select-dropdown-enter-active,
.pilot-select-dropdown-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.pilot-select-dropdown-enter-from,
.pilot-select-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
