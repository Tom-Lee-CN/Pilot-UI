<template>
  <div class="pilot-checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PilotCheckboxGroup',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    disabled: Boolean,
  },
  provide() {
    return {
      checkboxGroup: this,
    };
  },
  emits: ['update:modelValue', 'change'],
  methods: {
    handleChange(value) {
      this.$emit('update:modelValue', value);
      this.$emit('change', value);
    },
  },
};
</script>
