<template>
  <!-- 
    Option 组件的根元素 (li)
    - 使用 v-show 来根据搜索查询和自身文本内容决定是否显示
    - 动态绑定 class 来应用选中和禁用样式
    - 监听点击事件，通知父组件进行选择
  -->
  <li
    v-show="visible"
    class="pilot-option"
    :class="{ 'is-selected': isSelected, 'is-disabled': disabled }"
    @click="handleClick"
  >
    <!-- 插槽，用于显示选项的文本内容 -->
    <slot>{{ label }}</slot>
  </li>
</template>

<script>
export default {
  name: 'PilotOption', // 组件名
  props: {
    // 选项的显示文本
    label: {
      type: [String, Number],
      default: '',
    },
    // 选项的实际值
    value: {
      type: [String, Number, Boolean, Object],
      required: true,
    },
    // 是否禁用该选项
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  // 通过 inject 获取父组件 (select) 提供的上下文
  // 注入的 key 是 'selectContext'
  inject: ['selectContext'],
  data() {
    return {
      visible: true, // 控制选项是否可见
    };
  },
  computed: {
    // 计算当前选项是否被选中
    isSelected() {
      // 防御性检查，确保 selectContext 已被注入
      if (!this.selectContext) return false;

      if (this.selectContext.multiple) {
        // 多选模式下，检查 value 是否在父组件的 modelValue 数组中
        return this.selectContext.modelValue.includes(this.value);
      }
      // 单选模式下，直接比较 value 是否与父组件的 modelValue 相等
      return this.selectContext.modelValue === this.value;
    },
    // 获取当前选项的显示文本
    currentLabel() {
      return this.label || (this.$slots.default ? this.$slots.default()[0].children.trim() : '');
    },
  },
  watch: {
    // 监听父组件搜索查询的变化
    'selectContext.searchQuery'(newQuery) {
      if (!this.selectContext.filterable) return;
      // 如果查询为空，则显示选项
      if (!newQuery) {
        this.visible = true;
        return;
      }
      // 根据查询和选项文本（不区分大小写）来决定是否显示
      this.visible = this.currentLabel.toLowerCase().includes(newQuery.toLowerCase());
    },
  },
  methods: {
    // 处理点击事件
    handleClick() {
      if (!this.disabled && this.selectContext) {
        // 如果未被禁用，则调用父组件的 handleOptionSelect 方法
        this.selectContext.handleOptionSelect(this);
      }
    },
  },
  // 组件挂载后，将自身实例添加到父组件的 options 数组中
  mounted() {
    if (this.selectContext) {
      this.selectContext.addOption(this);
    }
  },
  // 组件卸载前，从父组件的 options 数组中移除自身实例
  beforeUnmount() {
    if (this.selectContext) {
      this.selectContext.removeOption(this);
    }
  },
};
</script>

<style scoped lang="scss">
/* 
  所有样式都由父组件 select.vue 通过 ::v-deep 控制，
  以保证样式的一致性和更好的封装性。
*/
</style>
