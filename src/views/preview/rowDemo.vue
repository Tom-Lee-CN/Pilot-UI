<template>
  <div class="demo">
    <h3>Row/Col Demo</h3>
    <row>
      <col :span="12"><pilot-card>Col 12</pilot-card></col>
      <col :span="12"><pilot-card>Col 12</pilot-card></col>
    </row>
  </div>
</template>
<script>
export default { name: 'rowDemo' };
</script>
<style scoped>
.demo { padding: 12px; }
</style>