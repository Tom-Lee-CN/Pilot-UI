<template>
  <div class="demo">
    <h3>InfiniteScroll Demo</h3>
    <pilot-scrollbar style="height:200px">
      <ul v-infinite-scroll="{ handler: loadMore, disabled: finished, distance: 10 }">
        <li v-for="i in items" :key="i">Item {{ i }}</li>
      </ul>
    </pilot-scrollbar>
    <pilot-button @click="reset">Reset</pilot-button>
  </div>
</template>
<script>
export default {
  name: 'infinitescrollDemo',
  data() { return { items: Array.from({ length: 20 }, (_, i) => i + 1), finished: false }; },
  methods: {
    loadMore() { if (this.items.length >= 60) { this.finished = true; return; } setTimeout(() => { const start = this.items.length + 1; this.items.push(...Array.from({ length: 10 }, (_, i) => start + i)); }, 500); },
    reset() { this.items = Array.from({ length: 20 }, (_, i) => i + 1); this.finished = false; }
  }
};
</script>
<style scoped>
.demo { padding: 12px; }
</style>