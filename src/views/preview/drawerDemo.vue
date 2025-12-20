<template>
  <div class="demo">
    <h3>Drawer Demo</h3>
    <pt-button @click="open = true">Open Drawer</pt-button>
    <pt-drawer v-model="open" title="Drawer">Drawer content</pt-drawer>
  </div>
</template>
<script>
export default {
  name: 'drawerDemo',
  data() {
    return { open: false };
  },
};
</script>
<style scoped>
.demo {
  padding: 12px;
}
</style>
