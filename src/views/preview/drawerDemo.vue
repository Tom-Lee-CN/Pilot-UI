<template>
  <div class="demo">
    <h3>Drawer Demo</h3>
    <pilot-button @click="open = true">Open Drawer</pilot-button>
    <pilot-drawer v-model="open" title="Drawer">Drawer content</pilot-drawer>
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
