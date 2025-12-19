<template>
  <div class="demo">
    <h3>Radio Demo</h3>
    <pilot-radio-group v-model="r">
      <pilot-radio label="a">A</pilot-radio>
      <pilot-radio label="b">B</pilot-radio>
    </pilot-radio-group>
    <p>Selected: {{ r }}</p>
  </div>
</template>
<script>
export default { name: 'radioDemo', data() { return { r: 'a' }; } };
</script>
<style scoped>
.demo { padding: 12px; }
</style>