<template>
  <div class="demo">
    <h3>Loading Demo</h3>
    <div v-loading="loading">
      <p>Content with loading</p>
    </div>
    <pilot-button @click="loading = !loading">Toggle Loading</pilot-button>
  </div>
</template>
<script>
export default { name: 'loadingDemo', data() { return { loading: false }; } };
</script>
<style scoped>
.demo { padding: 12px; }
</style>