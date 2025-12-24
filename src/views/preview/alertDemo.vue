<template>
  <div class="demo">
    <h3>Alert Demo</h3>
    <pt-alert title="Success" type="success" description="This is success." showIcon />
    <pt-alert
      title="Warning"
      type="warning"
      description="This is warning. 宽度自定义"
      :width="300"
    />
    <pt-alert title="Success" type="success" description="This is success." closable />
    <pt-alert title="Warning" type="warning" description="This is warning." :height="0" />
    <pt-alert type="warning" description="This is warning." />
  </div>
</template>
<script>
export default { name: 'alertDemo' };
</script>
<style scoped>
.demo {
  padding: 12px;
}
</style>
