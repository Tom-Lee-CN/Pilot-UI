<template>
  <div class="demo">
    <h3>Alert Demo</h3>
    <pilot-alert title="Success" type="success" description="This is success." showIcon />
    <pilot-alert
      title="Warning"
      type="warning"
      description="This is warning. 宽度自定义"
      :width="300"
    />
    <pilot-alert title="Success" type="success" description="This is success." closable />
    <pilot-alert title="Warning" type="warning" description="This is warning." :height="0" />
    <pilot-alert type="warning" description="This is warning." />
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
