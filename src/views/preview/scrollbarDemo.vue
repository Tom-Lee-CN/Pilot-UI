<template>
  <div class="demo">
    <h3>Scrollbar Demo</h3>
    <pilot-scrollbar style="height: 120px; display:block;">
      <div style="height:300px">Long content</div>
    </pilot-scrollbar>
  </div>
</template>
<script>
export default { name: 'scrollbarDemo' };
</script>
<style scoped>
.demo { padding: 12px; }
</style>