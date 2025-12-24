<template>
  <div class="demo">
    <h3>Modal Demo</h3>
    <pt-button @click="open = true">Open Modal</pt-button>
    <pt-modal v-model="open" title="Demo Modal">
      <p>Modal content</p>
    </pt-modal>
  </div>
</template>
<script>
export default {
  name: 'modalDemo',
  data() {
    return { open: false };
  },
};
</script>
<style scoped>
.demo {
  padding: 12px;
}
</style>
