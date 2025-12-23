<template>
  <!-- 
    Select 组件的根元素
    - 监听点击事件来切换下拉框的显示/隐藏
    - 监听鼠标进入/离开事件来控制清除按钮的显示
    - 动态绑定 class 来应用禁用和多选样式
  -->
  <div
    ref="selectWrapper"
    class="pilot-select"
    :class="{ 'is-disabled': disabled, 'is-multiple': multiple }"
    @click="toggleDropdown"
    @mouseenter="inputHovering = true"
    @mouseleave="inputHovering = false"
  >
    <!-- 输入框区域，用于显示已选项和占位符 -->
    <div
      class="pilot-select__input"
      :style="{ height: multiple && modelValue.length > 0 ? 'auto' : null }"
    >
      <!-- 多选模式下，显示已选中的标签 -->
      <div v-if="multiple && modelValue.length > 0" class="pilot-select__tags">
        <span v-for="item in selectedItems" :key="item.value" class="pilot-select__tag">
          {{ item.label || (item.$el ? item.$el.textContent.trim() : '') }}
          <!-- 标签上的关闭按钮，用于移除该选项 -->
          <pt-icon
            name="close"
            class="pilot-select__tag-close"
            @click.stop="removeTag(item)"
          ></pt-icon>
        </span>
      </div>

      <!-- 单选模式下，显示已选中的项的文本 -->
      <span v-else-if="!multiple && selectedLabel" class="pilot-select__selected-label">
        {{ selectedLabel }}
      </span>

      <!-- 没有选中任何值时，显示占位符 -->
      <span v-else class="is-placeholder">{{ placeholder }}</span>

      <!-- 输入框的后缀图标区域 -->
      <div class="pilot-select__suffix">
        <!-- 清除按钮，当 clearable 为 true、有值且鼠标悬浮时显示 -->
        <pt-icon
          v-if="showClearIcon"
          class="pilot-select__clear"
          name="circle-close"
          @click.stop="handleClear"
        ></pt-icon>
        <!-- 下拉箭头，根据下拉框的显示状态旋转 -->
        <pt-icon
          class="pilot-select__arrow"
          :class="{ 'is-reverse': dropdownVisible }"
          name="arrow-right"
        ></pt-icon>
      </div>
    </div>

    <!-- 下拉菜单，使用 transition 组件实现动画效果 -->
    <transition name="pilot-select-dropdown">
      <div v-show="dropdownVisible" class="pilot-select__dropdown" @click.stop>
        <!-- 搜索输入框 -->
        <div v-if="filterable" class="pilot-select__search-wrapper">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索"
            class="pilot-select__search-input"
            @click.stop
          />
        </div>
        <ul class="pilot-select__options">
          <!-- 创建新条目 -->
          <li
            v-if="showCreateOption"
            class="pilot-option pilot-option__create"
            @click="handleCreateOption"
          >
            创建条目 "{{ searchQuery }}"
          </li>
          <!-- 选项的插槽，用于接收 pt-option 组件 -->
          <slot></slot>
          <!-- 无数据提示 -->
          <li v-if="showNoDataText" class="pilot-select__no-data">无匹配数据</li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'PilotSelect', // 组件名
  props: {
    // v-model 绑定的值
    modelValue: {
      type: [String, Number, Array],
      default: '',
    },
    // 占位符文本
    placeholder: {
      type: String,
      default: '请选择',
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: false,
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 是否可搜索
    filterable: {
      type: Boolean,
      default: false,
    },
    // 是否允许创建新条目（仅在 filterable 为 true 时有效）
    allowCreate: {
      type: Boolean,
      default: false,
    },
  },
  // 定义组件触发的事件
  emits: ['update:modelValue', 'clear', 'remove-tag'],
  data() {
    return {
      dropdownVisible: false, // 控制下拉框是否可见
      options: [], // 存储所有子组件 (pt-option) 的实例
      inputHovering: false, // 鼠标是否悬浮在输入框上
      searchQuery: '', // 搜索查询
    };
  },
  // 使用 provide 向后代组件注入 select 组件的上下文 (this)
  // 注入的 key 使用 'selectContext' 以避免潜在的命名冲突
  provide() {
    return {
      selectContext: this,
    };
  },
  computed: {
    // 计算多选模式下已选中的选项对象数组
    selectedItems() {
      if (!this.multiple) return [];
      if (!Array.isArray(this.modelValue)) return [];

      return this.modelValue
        .map((value) => {
          const option = this.options.find((o) => o.value === value);
          if (option) {
            return option;
          }
          // For created items that don't have a corresponding pt-option
          if (this.allowCreate) {
            return { value: value, label: value };
          }
          return null;
        })
        .filter(Boolean);
    },
    // 计算单选模式下已选中的选项的 label
    selectedLabel() {
      if (this.multiple) return '';
      const selectedOption = this.options.find((option) => option.value === this.modelValue);
      if (selectedOption) {
        // 优先使用 label prop，如果不存在，则回退到使用 option 组件的文本内容
        return (
          selectedOption.label || (selectedOption.$el ? selectedOption.$el.textContent.trim() : '')
        );
      }
      return '';
    },
    // 计算是否显示清除按钮
    showClearIcon() {
      const hasValue = this.multiple ? this.modelValue.length > 0 : this.modelValue;
      return this.clearable && hasValue && this.inputHovering;
    },
    matchingOptions() {
      if (!this.filterable || !this.searchQuery) {
        return this.options;
      }
      return this.options.filter((option) =>
        option.currentLabel.toLowerCase().includes(this.searchQuery.toLowerCase()),
      );
    },
    // 是否显示“创建新条目”的选项
    showCreateOption() {
      return (
        this.filterable && this.allowCreate && this.searchQuery && this.matchingOptions.length === 0
      );
    },
    // 是否显示“无匹配数据”
    showNoDataText() {
      return this.filterable && this.matchingOptions.length === 0 && !this.showCreateOption;
    },
  },
  methods: {
    // 切换下拉框的显示/隐藏状态
    toggleDropdown() {
      if (this.disabled) return;
      this.dropdownVisible = !this.dropdownVisible;
    },
    // 处理选项点击事件
    handleOptionSelect(option) {
      if (this.multiple) {
        // 多选模式
        const currentValue = [...this.modelValue];
        const index = currentValue.indexOf(option.value);
        if (index > -1) {
          // 如果已存在，则移除
          currentValue.splice(index, 1);
        } else {
          // 如果不存在，则添加
          currentValue.push(option.value);
        }
        this.$emit('update:modelValue', currentValue);
      } else {
        // 单选模式
        this.$emit('update:modelValue', option.value);
        this.dropdownVisible = false; // 选择后关闭下拉框
      }
      // 如果是可搜索的，在选择后清空搜索词
      if (this.filterable) {
        this.searchQuery = '';
      }
    },
    // 清空已选值
    handleClear() {
      const value = this.multiple ? [] : '';
      this.$emit('update:modelValue', value);
      this.$emit('clear');
    },
    // 移除一个多选标签
    removeTag(item) {
      if (this.disabled) return;
      const currentValue = [...this.modelValue];
      const index = currentValue.indexOf(item.value);
      if (index > -1) {
        currentValue.splice(index, 1);
        this.$emit('update:modelValue', currentValue);
        this.$emit('remove-tag', item.value);
      }
    },
    // 添加一个 option 实例到 options 数组
    addOption(option) {
      this.options.push(option);
    },
    // 从 options 数组中移除一个 option 实例
    removeOption(option) {
      const index = this.options.findIndex((o) => o.value === option.value);
      if (index > -1) {
        this.options.splice(index, 1);
      }
    },
    // 处理组件外部的点击事件，用于关闭下拉框
    handleOutsideClick(event) {
      if (this.$refs.selectWrapper && !this.$refs.selectWrapper.contains(event.target)) {
        this.dropdownVisible = false;
      }
    },
    handleCreateOption() {
      const newValue = this.searchQuery;
      if (this.multiple) {
        // 多选模式：将新值添加到数组中
        const currentValue = [...this.modelValue, newValue];
        this.$emit('update:modelValue', currentValue);
      } else {
        // 单选模式：直接设置新值
        this.$emit('update:modelValue', newValue);
        this.dropdownVisible = false; // 关闭下拉框
      }
      this.searchQuery = ''; // 清空搜索框
    },
  },
  // 组件挂载时，添加全局点击事件监听
  mounted() {
    document.addEventListener('click', this.handleOutsideClick);
  },
  // 组件卸载前，移除全局点击事件监听
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
};
</script>

<style scoped lang="scss">
// 导入 SCSS 模块
@use '../../../styles/variables.scss' as *;
@use 'sass:color';

// Select 组件根样式
.pilot-select {
  position: relative;
  display: inline-block;
  width: 100%;
  cursor: pointer;

  // 禁用状态
  &.is-disabled {
    cursor: not-allowed;
    .pilot-select__input {
      background-color: $select-disabled-bg;
      color: $select-disabled-color;
      border-color: $select-disabled-border-color;
    }
  }
}

// 输入框区域
.pilot-select__input {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: $select-input-height;
  padding: 5px 30px 5px 15px;
  border: 1px solid $select-input-border-color;
  border-radius: $select-input-border-radius;
  background-color: $color-white;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    border-color: $select-input-hover-border-color;
  }

  // 占位符样式
  .is-placeholder {
    color: $select-input-placeholder-color;
  }
}

// 单选时已选值的文本样式
.pilot-select__selected-label {
  color: $select-input-color;
}

// 多选标签容器
.pilot-select__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

// 多选标签
.pilot-select__tag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  font-size: 12px;
  color: $primary-color;
  background-color: color.mix($primary-color, $color-white, 10%);
  border: 1px solid color.mix($primary-color, $color-white, 40%);
  border-radius: 4px;
}

// 标签关闭按钮
.pilot-select__tag-close {
  margin-left: 6px;
  font-size: 12px;
  color: $primary-color;
  cursor: pointer;
  border-radius: 50%;
  &:hover {
    background-color: $primary-color;
    color: $color-white;
  }
}

// 后缀图标区域
.pilot-select__suffix {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}

// 箭头和清除按钮的通用样式
.pilot-select__arrow,
.pilot-select__clear {
  color: $text-color-placeholder;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

// 清除按钮
.pilot-select__clear {
  margin-right: 8px;
  &:hover {
    color: $text-color-secondary;
  }
}

// 下拉箭头
.pilot-select__arrow {
  transition: transform 0.3s;
  // 下拉框展开时，箭头旋转90度
  &.is-reverse {
    transform: rotate(90deg);
  }
}

// 下拉菜单
.pilot-select__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  z-index: 10;
  border: 1px solid $select-dropdown-border-color;
  border-radius: $select-input-border-radius;
  background-color: $select-dropdown-bg;
  box-shadow: $select-dropdown-shadow;
}

// 搜索框包裹容器
.pilot-select__search-wrapper {
  padding: 8px 12px 4px;
}

// 搜索输入框
.pilot-select__search-input {
  width: 100%;
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid $select-input-border-color;
  border-radius: $select-input-border-radius;
  outline: none;
  &:focus {
    border-color: $primary-color;
  }
}

// 选项列表
.pilot-select__options {
  list-style: none;
  padding: $select-dropdown-padding;
  margin: 0;
  max-height: 274px;
  overflow: auto;
}

// 无数据提示
.pilot-select__no-data {
  padding: 10px 20px;
  color: #999;
  text-align: center;
  font-size: 14px;
}
// “创建条目”选项，它会继承 .pilot-option 的样式
.pilot-option__create {
  // 这里可以添加或覆盖特定样式，例如颜色
  color: #67c23a; // 使用一个醒目的颜色表示“创建”
}

// 下拉菜单的进入/离开动画
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

// 使用 ::v-deep 穿透 scoped 限制，为子组件 pilot-option 设置样式
// 这样做可以确保 Select 组件完全控制其子项的样式，增强封装性
::v-deep(.pilot-option) {
  height: $select-option-height;
  line-height: $select-option-height;
  font-size: $select-option-font-size;
  color: $select-option-text-color;
  padding: 0 20px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  // 鼠标悬浮样式
  &:hover {
    background-color: $select-option-hover-bg;
  }

  // 选中状态样式
  &.is-selected {
    color: $select-option-selected-color;
    font-weight: $select-option-selected-font-weight;
  }

  // 禁用状态样式
  &.is-disabled {
    color: $text-color-disabled;
    cursor: not-allowed;
    &:hover {
      background-color: transparent;
    }
  }
}
</style>
