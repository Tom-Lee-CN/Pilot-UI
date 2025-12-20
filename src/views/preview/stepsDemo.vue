<template>
  <div class="demo">
    <h3>Steps Demo</h3>
    <pt-steps :active="1">
      <pt-step title="Step 1" />
      <pt-step title="Step 2" />
    </pt-steps>
  </div>
</template>
<script>
export default { name: 'stepsDemo' };
</script>
<style scoped>
.demo {
  padding: 12px;
}
</style>
