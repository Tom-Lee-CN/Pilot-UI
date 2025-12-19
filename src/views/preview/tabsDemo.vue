<template>
  <div class="demo">
    <h3>Tabs Demo</h3>
    <pilot-tabs v-model="active">
      <pilot-tab-pane label="One" name="one">Content One</pilot-tab-pane>
      <pilot-tab-pane label="Two" name="two">Content Two</pilot-tab-pane>
    </pilot-tabs>
  </div>
</template>
<script>
export default { name: 'tabsDemo', data() { return { active: 'one' }; } };
</script>
<style scoped>
.demo { padding: 12px; }
</style>