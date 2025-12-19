<template>
  <span class="pilot-breadcrumb__item">
    <span :class="['pilot-breadcrumb__inner', to ? 'is-link' : '']" role="link" @click="onClick">
      <slot></slot>
    </span>
    <i v-if="separatorClass" class="pilot-breadcrumb__separator" :class="separatorClass"></i>
    <span v-else class="pilot-breadcrumb__separator" role="presentation">{{ separator }}</span>
  </span>
</template>

<script>
export default {
  name: 'PilotBreadcrumbItem',
  props: {
    to: {
      type: [String, Object],
      default: '',
    },
    replace: {
      type: Boolean,
      default: false,
    },
  },
  // 注入来自父组件 Breadcrumb 提供的数据
  inject: ['breadcrumbContext'],
  computed: {
    // 从注入的上下文中获取分隔符
    separator() {
      return this.breadcrumbContext.separator;
    },
    // 从注入的上下文中获取分隔符的自定义类名
    separatorClass() {
      return this.breadcrumbContext.separatorClass;
    },
  },
  methods: {
    // 处理点击事件，进行路由跳转
    onClick() {
      // 如果没有设置 to 或者没有 $router，则不执行任何操作
      if (!this.to || !this.$router) return;
      // 根据 replace prop 决定使用 push 还是 replace
      this.replace ? this.$router.replace(this.to) : this.$router.push(this.to);
    },
  },
};
</script>
