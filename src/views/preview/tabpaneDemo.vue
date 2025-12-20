<template>
  <div class="demo">
    <h3>TabPane Demo</h3>
    <pt-tabs v-model="active">
      <pt-tab-pane label="A" name="a">A</pt-tab-pane>
      <pt-tab-pane label="B" name="b">B</pt-tab-pane>
    </pt-tabs>
  </div>
</template>
<script>
export default {
  name: 'tabpaneDemo',
  data() {
    return { active: 'a' };
  },
};
</script>
<style scoped>
.demo {
  padding: 12px;
}
</style>
