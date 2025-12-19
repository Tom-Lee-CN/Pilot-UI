<template>
  <div class="demo">
    <h3>Input Demo</h3>
    <pilot-input v-model="val" placeholder="Type..." />
    <p>Value: {{ val }}</p>
  </div>
</template>
<script>
export default {
  name: 'inputDemo',
  data() { return { val: '' }; }
};
</script>
<style scoped>
.demo { padding: 12px; }
</style>