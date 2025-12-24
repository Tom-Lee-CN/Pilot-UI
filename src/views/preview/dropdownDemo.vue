<template>
  <div>
    <h2>Dropdown 下拉菜单</h2>
    <div class="demo-block">
      <h3>基础用法</h3>
      <pt-dropdown @command="handleCommand" trigger="hover">
        <template #trigger>
          <pt-button type="primary">
            下拉菜单 <i class="pt-icon-arrow-down pt-icon--right"></i>
          </pt-button>
        </template>
        <pt-dropdown-item command="a">黄金糕</pt-dropdown-item>
        <pt-dropdown-item command="b">狮子头</pt-dropdown-item>
        <pt-dropdown-item command="c">螺蛳粉</pt-dropdown-item>
        <pt-dropdown-item command="d" disabled>双皮奶</pt-dropdown-item>
        <pt-dropdown-item command="e" divided>蚵仔煎</pt-dropdown-item>
      </pt-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropdownDemo',
  methods: {
    handleCommand(command) {
      this.$message(`clicked on item ${command}`);
    },
  },
};
</script>

<style scoped>
.demo-block {
  margin-bottom: 20px;
}
.demo-block h3 {
  margin-bottom: 10px;
}
</style>
