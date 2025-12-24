<template>
  <div class="demo">
    <h3>Tabs Demo</h3>
    <pt-tabs v-model="active">
      <pt-tab-pane label="One" name="one">Content One</pt-tab-pane>
      <pt-tab-pane label="Two" name="two">Content Two</pt-tab-pane>
    </pt-tabs>
  </div>
</template>
<script>
export default {
  name: 'tabsDemo',
  data() {
    return { active: 'one' };
  },
};
</script>
<style scoped>
.demo {
  padding: 12px;
}
</style>
