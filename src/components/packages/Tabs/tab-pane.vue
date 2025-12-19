<template>
  <div class="pilot-tab-pane" v-show="isActive">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PilotTabPane',
  props: {
    label: {
      type: String,
      default: '',
    },
    name: {
      type: [String, Number],
      required: true,
    },
  },
  inject: ['rootTabs'],
  computed: {
    isActive() {
      return this.rootTabs.modelValue === this.name;
    },
  },
};
</script>
