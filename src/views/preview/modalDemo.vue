<template>
  <div class="demo">
    <h3>Modal Demo</h3>
    <pilot-button @click="open = true">Open Modal</pilot-button>
    <pilot-modal v-model="open" title="Demo Modal">
      <p>Modal content</p>
    </pilot-modal>
  </div>
</template>
<script>
export default { name: 'modalDemo', data() { return { open: false }; } };
</script>
<style scoped>
.demo { padding: 12px; }
</style>