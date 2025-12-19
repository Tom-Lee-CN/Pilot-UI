<template>
  <div class="demo">
    <h3>TabPane Demo</h3>
    <pilot-tabs v-model="active">
      <pilot-tab-pane label="A" name="a">A</pilot-tab-pane>
      <pilot-tab-pane label="B" name="b">B</pilot-tab-pane>
    </pilot-tabs>
  </div>
</template>
<script>
export default { name: 'tabpaneDemo', data() { return { active: 'a' }; } };
</script>
<style scoped>
.demo { padding: 12px; }
</style>