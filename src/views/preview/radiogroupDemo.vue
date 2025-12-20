<template>
  <div class="demo">
    <h3>RadioGroup Demo</h3>
    <pt-radio-group v-model="r">
      <pt-radio label="1">One</pt-radio>
      <pt-radio label="2">Two</pt-radio>
    </pt-radio-group>
  </div>
</template>
<script>
export default {
  name: 'radiogroupDemo',
  data() {
    return { r: '1' };
  },
};
</script>
<style scoped>
.demo {
  padding: 12px;
}
</style>
