<template>
  <div class="demo">
    <h3>Checkbox Demo</h3>

    <h4>Basic Usage</h4>
    <pt-checkbox v-model="checked1" label="Option 1" />
    <pt-checkbox v-model="checked2" label="Option 2" />
    <p>Checked: {{ checked1 }}, {{ checked2 }}</p>

    <h4>Disabled</h4>
    <pt-checkbox v-model="checked3" label="Disabled Unchecked" disabled />
    <pt-checkbox v-model="checked4" label="Disabled Checked" />

    <h4>Checkbox Group</h4>
    <pt-checkbox-group v-model="checkedGroup">
      <pt-checkbox label="Option A" />
      <pt-checkbox label="Option B" />
      <pt-checkbox label="Option C" />
      <pt-checkbox label="Option D (disabled)" disabled />
    </pt-checkbox-group>
    <p>Checked Group: {{ checkedGroup }}</p>

    <h4>Disabled Checkbox Group</h4>
    <pt-checkbox-group v-model="checkedGroup2" disabled>
      <pt-checkbox label="Option A" />
      <pt-checkbox label="Option B" />
      <pt-checkbox label="Option C" />
    </pt-checkbox-group>
    <p>Checked Group (disabled): {{ checkedGroup2 }}</p>
  </div>
</template>

<script>
export default {
  name: 'checkboxDemo',
  data() {
    return {
      checked1: true,
      checked2: false,
      checked3: false,
      checked4: true,
      checkedGroup: ['Option A'],
      checkedGroup2: ['Option B'],
    };
  },
};
</script>

<style scoped>
.demo {
  padding: 20px;
}
h4 {
  margin-top: 20px;
  margin-bottom: 10px;
}
p {
  margin-top: 10px;
}
</style>
