<template>
  <div class="demo">
    <h3>Select Demo</h3>
    <pilot-select v-model="sel" :options="options" />
    <p>Selected: {{ sel }}</p>
  </div>
</template>
<script>
export default { name: 'selectDemo', data() { return { sel: '', options: [{ label: 'One', value: '1' }, { label: 'Two', value: '2' }] }; } };
</script>
<style scoped>
.demo { padding: 12px; }
</style>