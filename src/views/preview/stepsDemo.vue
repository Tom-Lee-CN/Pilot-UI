<template>
  <div class="demo">
    <h3>Steps Demo</h3>
    <pilot-steps :active="1">
      <pilot-step title="Step 1" />
      <pilot-step title="Step 2" />
    </pilot-steps>
  </div>
</template>
<script>
export default { name: 'stepsDemo' };
</script>
<style scoped>
.demo { padding: 12px; }
</style>