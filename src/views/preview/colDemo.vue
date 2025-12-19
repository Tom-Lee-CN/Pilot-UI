<template>
  <div class="demo">
    <h3>Col Demo</h3>
    <row>
      <col :span="8"><pilot-card>8</pilot-card></col>
      <col :span="8"><pilot-card>8</pilot-card></col>
      <col :span="8"><pilot-card>8</pilot-card></col>
    </row>
  </div>
</template>
<script>
export default { name: 'colDemo' };
</script>
<style scoped>
.demo { padding: 12px; }
</style>