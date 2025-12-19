<template>
  <div class="demo">
    <h3>Switch Demo</h3>
    <pilot-switch v-model="on" />
    <p>On: {{ on }}</p>
  </div>
</template>
<script>
export default { name: 'switchDemo', data() { return { on: false }; } };
</script>
<style scoped>
.demo { padding: 12px; }
</style>