<template>
  <div class="demo">
    <h3>Radio Demo</h3>
    <pt-radio-group v-model="r">
      <pt-radio label="a">A</pt-radio>
      <pt-radio label="b">B</pt-radio>
    </pt-radio-group>
    <p>Selected: {{ r }}</p>
  </div>
</template>
<script>
export default {
  name: 'radioDemo',
  data() {
    return { r: 'a' };
  },
};
</script>
<style scoped>
.demo {
  padding: 12px;
}
</style>
