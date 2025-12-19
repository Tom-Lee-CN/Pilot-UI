<template>
  <div class="demo">
    <h3>RadioGroup Demo</h3>
    <pilot-radio-group v-model="r">
      <pilot-radio label="1">One</pilot-radio>
      <pilot-radio label="2">Two</pilot-radio>
    </pilot-radio-group>
  </div>
</template>
<script>
export default { name: 'radiogroupDemo', data() { return { r: '1' }; } };
</script>
<style scoped>
.demo { padding: 12px; }
</style>