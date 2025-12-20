<template>
  <div class="demo">
    <h3>Col Demo</h3>
    <pt-row>
      <pt-col :span="8"><pt-card>8</pt-card></pt-col>
      <pt-col :span="8"><pt-card>8</pt-card></pt-col>
      <pt-col :span="8"><pt-card>8</pt-card></pt-col>
    </pt-row>
  </div>
</template>
<script>
export default { name: 'colDemo' };
</script>
<style scoped>
.demo {
  padding: 12px;
}
</style>
