<template>
  <!-- 组件根元素 -->
  <div
    class="pt-cascader"
    ref="cascader"
    @click="toggleDropdown"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <!-- 输入框区域 -->
    <div :class="['pt-cascader__input', { 'is-disabled': disabled, 'is-multiple': multiple }]">
      <!-- 多选模式下显示的标签 -->
      <div v-if="multiple && modelValue.length > 0" class="pt-cascader__tags">
        <span
          v-for="(labels, index) in multiSelectLabels"
          :key="modelValue[index].join(',')"
          class="pt-cascader__tag"
        >
          <span>{{ labels.join(' / ') }}</span>
          <!-- 标签关闭按钮 -->
          <pt-icon
            name="close"
            class="pt-cascader__tag-close"
            @click.stop="handleTagClose(index)"
          ></pt-icon>
        </span>
      </div>
      <!-- 单选模式下显示的已选值 -->
      <span v-else-if="!multiple && displayValue" class="pt-cascader__input-value">{{
        displayValue
      }}</span>
      <!-- 占位文本 -->
      <span v-else class="pt-cascader__input-placeholder">{{ placeholder }}</span>

      <!-- 后缀图标区域 -->
      <div class="pt-cascader-suffix">
        <!-- 清除按钮 -->
        <pt-icon
          v-if="clearable && modelValue.length > 0 && isHovering"
          name="circle-close"
          class="pt-cascader-clear"
          @click.stop="handleClear"
        ></pt-icon>
        <!-- 下拉箭头 -->
        <pt-icon
          v-else
          name="arrow-right"
          class="pt-cascader-arrow"
          :class="{ 'is-reverse': visible }"
        ></pt-icon>
      </div>
    </div>

    <!-- 下拉面板 -->
    <transition name="fade">
      <div v-if="visible" class="pt-cascader__dropdown" @click.stop>
        <pt-cascader-panel
          :options="options"
          :model-value="modelValue"
          :props="props"
          :lazy="lazy"
          :lazy-load="lazyLoad"
          :multiple="multiple"
          @change="handlePanelChange"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import PtCascaderPanel from './cascader-panel.vue';

export default {
  name: 'PilotCascader',
  components: { PtCascaderPanel },
  // 声明组件会触发的自定义事件，用于 Vue3 的事件监听器校验
  emits: ['update:modelValue', 'change'],
  props: {
    // 绑定值 (v-model)
    modelValue: {
      type: Array,
      default: () => [],
    },
    // 级联选择器的数据源
    options: {
      type: Array,
      default: () => [],
    },
    // 输入框占位文本
    placeholder: {
      type: String,
      default: 'Select',
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 配置选项，用于自定义 value, label, children 的键名
    props: {
      type: Object,
      default: () => ({}),
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: false,
    },
    // 是否开启懒加载
    lazy: {
      type: Boolean,
      default: false,
    },
    // 懒加载函数，当 lazy 为 true 时生效
    lazyLoad: {
      type: Function,
      default: null,
    },
    // 是否开启多选
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false, // 控制下拉面板的显示与隐藏
      isHovering: false, // 鼠标是否悬浮在组件上
      selectedLabels: [], // 单选模式下的标签路径
      multiSelectLabels: [], // 多选模式下的标签路径集合
    };
  },
  computed: {
    // 合并默认配置和用户传入的 props
    config() {
      return {
        value: 'value',
        label: 'label',
        children: 'children',
        ...this.props,
      };
    },
    // 计算并显示在输入框中的值
    displayValue() {
      // 多选或无值时返回空
      if (this.multiple || !this.modelValue || this.modelValue.length === 0) {
        return '';
      }
      // 懒加载模式下，直接使用已保存的 labels
      if (this.lazy && this.selectedLabels.length > 0) {
        return this.selectedLabels.join(' / ');
      }
      // 非懒加载模式下，如果 options 为空，也返回空
      if (!this.options || this.options.length === 0) return '';

      // 遍历 modelValue，从 options 中找到对应的 label
      const labels = [];
      let currentOptions = this.options;
      for (const value of this.modelValue) {
        const selectedItem = currentOptions.find((option) => option[this.config.value] === value);
        if (selectedItem) {
          labels.push(selectedItem[this.config.label]);
          currentOptions = selectedItem[this.config.children];
          if (!currentOptions) break; // 如果没有子节点，则停止遍历
        } else {
          // 如果在 options 中找不到对应的值
          // 如果是懒加载模式，可能数据还未加载，直接使用 selectedLabels
          if (this.lazy) return this.selectedLabels.join(' / ');
          // 否则返回空字符串
          return '';
        }
      }
      return labels.join(' / ');
    },
  },
  watch: {
    // 监听 v-model 的变化，清空时重置 labels
    modelValue(newVal) {
      if (!newVal || newVal.length === 0) {
        this.selectedLabels = [];
        this.multiSelectLabels = [];
      }
    },
    // 监听下拉面板的显示状态
    visible(newVal) {
      if (!newVal) {
        this.isHovering = false; // 关闭时取消悬浮状态
      }
    },
  },
  methods: {
    // 切换下拉面板的显示/隐藏
    toggleDropdown() {
      if (this.disabled) return;
      this.visible = !this.visible;
    },
    // 处理点击组件外部的逻辑
    handleClickOutside(event) {
      if (this.$refs.cascader && !this.$refs.cascader.contains(event.target)) {
        this.visible = false;
      }
    },
    // 清空已选值
    handleClear() {
      this.$emit('update:modelValue', []);
      this.$emit('change', []);
      this.selectedLabels = [];
      this.multiSelectLabels = [];
      this.visible = false; // 清空后关闭下拉面板
    },
    // 处理子组件 cascader-panel 派发的 change 事件
    handlePanelChange(values, labels) {
      if (this.multiple) {
        // 多选模式
        this.multiSelectLabels = labels;
        this.$emit('update:modelValue', values);
        this.$emit('change', values);
        // 多选时点击后不关闭面板，方便连续选择
      } else {
        // 单选模式
        this.selectedLabels = labels;
        this.$emit('update:modelValue', values);
        this.$emit('change', values);
        this.visible = false; // 单选时选择后自动关闭面板
      }
    },
    // 处理多选标签的关闭事件
    handleTagClose(index) {
      // 复制当前 modelValue 和 labels
      const newModelValue = [...this.modelValue];
      // 移除对应索引的项
      newModelValue.splice(index, 1);

      const newLabels = [...this.multiSelectLabels];
      newLabels.splice(index, 1);

      // 调用 handlePanelChange 更新状态，保持逻辑统一
      this.handlePanelChange(newModelValue, newLabels);
    },
  },
  mounted() {
    // 添加全局点击事件监听，用于点击外部关闭下拉面板
    document.addEventListener('click', this.handleClickOutside);
    // 在非懒加载模式下，如果未提供 options，则发出警告
    if (!this.lazy && (!this.options || this.options.length === 0)) {
      console.warn('[PilotCascader] "options" prop is required when not in lazy mode.');
    }
  },
  beforeUnmount() {
    // 组件卸载前移除全局点击事件监听
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>

<style lang="scss" scoped>
@use '../../../styles/variables.scss';

// 根元素样式
.pt-cascader {
  position: relative;
  display: inline-block;
  width: 240px;
  font-size: 14px;
}

// 输入框样式
.pt-cascader__input {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 32px;
  padding: 3px 30px 3px 15px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:hover {
    border-color: $select-input-hover-border-color;
  }

  // 禁用状态
  &.is-disabled {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
  }

  // 多选模式，高度自适应
  &.is-multiple {
    height: auto;
    line-height: normal;
  }
}

// 多选标签容器
.pt-cascader__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

// 单个多选标签
.pt-cascader__tag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  background-color: #f0f2f5;
  border: 1px solid #e9e9eb;
  border-radius: 4px;
  color: #909399;
  font-size: 12px;

  span {
    line-height: 1;
  }
}

// 标签关闭按钮
.pt-cascader__tag-close {
  margin-left: 6px;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    color: $primary-color;
  }
}

// 单选模式显示值
.pt-cascader__input-value {
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 24px;
}

// 占位符样式
.pt-cascader__input-placeholder {
  color: #c0c4cc;
  line-height: 24px;
}

// 后缀图标容器
.pt-cascader-suffix {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: absolute;
  right: 10px;
  top: 0;
  color: #c0c4cc;
  transition: all 0.3s;
}

// 清除按钮
.pt-cascader-clear {
  font-size: 14px;
  color: #c0c4cc;
  cursor: pointer;
  &:hover {
    color: #909399;
  }
}

// 下拉箭头
.pt-cascader-arrow {
  transition: transform 0.3s;
  font-size: 12px;
  // 面板展开时旋转箭头
  &.is-reverse {
    transform: rotate(90deg);
  }
}

// 下拉菜单容器
.pt-cascader__dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  z-index: 1000;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

// 淡入淡出动画
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  transform-origin: top center;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.8);
}
</style>
