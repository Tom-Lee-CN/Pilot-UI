<template>
  <div class="pilot-radio-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PilotRadioGroup',
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleChange(value) {
      this.$emit('update:modelValue', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.pilot-radio-group {
  display: inline-flex;
  flex-wrap: wrap;
  font-size: 0;
}
</style>
