<template>
  <div class="demo">
    <h3>Input Demo</h3>
    <pt-input v-model="val" placeholder="Type..." size="large" clearable />
    <pt-input v-model="val" placeholder="Type..." size="medium" showPassword type="password" />
    <pt-input v-model="val" placeholder="Type..." size="small" showWordLimit maxlength="10" />
    <pt-input v-model="val" placeholder="Type..." disabled />
    <p>Value: {{ val }}</p>
  </div>
</template>
<script>
export default {
  name: 'inputDemo',
  data() {
    return { val: '' };
  },
};
</script>
<style scoped>
.demo {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
