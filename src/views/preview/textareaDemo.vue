<template>
  <div class="demo">
    <h3>Textarea Demo</h3>
    <pt-textarea v-model="val" placeholder="Text..." />
    <p>Length: {{ (val || '').length }}</p>
  </div>
</template>
<script>
export default {
  name: 'textareaDemo',
  data() {
    return { val: '' };
  },
};
</script>
<style scoped>
.demo {
  padding: 12px;
}
</style>
