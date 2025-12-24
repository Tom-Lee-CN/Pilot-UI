<template>
  <li class="pt-dropdown-item" :class="{ 'is-disabled': disabled }" @click="handleClick">
    <slot></slot>
  </li>
</template>

<script>
export default {
  name: 'PilotDropdownItem',
  props: {
    command: {
      type: [String, Number, Object],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['dropdown'],
  methods: {
    handleClick() {
      if (this.disabled) {
        return;
      }
      this.dropdown.handleMenuItemClick(this.command);
    },
  },
};
</script>

<style scoped>
.pt-dropdown-item {
  list-style: none;
  padding: 8px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.pt-dropdown-item:hover {
  background-color: #ecf5ff;
  color: #409eff;
}

.pt-dropdown-item.is-disabled {
  color: #c0c4cc;
  cursor: not-allowed;
  background-color: transparent;
}
</style>
