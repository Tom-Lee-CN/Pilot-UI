<template>
  <div class="demo">
    <h3>Row/Col Demo</h3>
    <pt-row>
      <pt-col :span="12"><pt-card>Col 12</pt-card></pt-col>
      <pt-col :span="12"><pt-card>Col 12</pt-card></pt-col>
    </pt-row>
  </div>
</template>
<script>
export default { name: 'rowDemo' };
</script>
<style scoped>
.demo {
  padding: 12px;
}
</style>
