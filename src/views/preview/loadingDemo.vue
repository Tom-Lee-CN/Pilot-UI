<template>
  <div class="demo">
    <h3>Loading Demo</h3>
    <div v-loading="{ value: loading, text: '拼命加载中...' }" class="test">
      <p>Content with loading</p>
    </div>
    <pt-button @click="loading = !loading">Toggle Loading</pt-button>
  </div>
</template>
<script>
export default {
  name: 'loadingDemo',
  data() {
    return { loading: false };
  },
};
</script>
<style scoped lang="scss">
.demo {
  padding: 12px;
  & .test {
    height: 500px;
  }
}
</style>
