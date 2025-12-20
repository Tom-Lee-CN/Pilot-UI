<template>
  <div class="demo">
    <h3>Button Demo</h3>
    <pt-button>Default</pt-button>
    <pt-button type="primary">Primary</pt-button>
    <pt-button type="success">Success</pt-button>
    <pt-button type="danger">Primary</pt-button>
    <pt-button type="warning">Success</pt-button>
    <pt-button type="info">Success</pt-button>
  </div>
  <div class="demo">
    <h3>Button Demo</h3>
    <pt-button size="large">大号按钮</pt-button>
    <pt-button type="primary" size="default">中号按钮</pt-button>
    <pt-button type="success" size="small">小号按钮</pt-button>
    <pt-button type="danger">Primary</pt-button>
    <pt-button type="warning">Success</pt-button>
    <pt-button type="info">Success</pt-button>
  </div>
  <div class="demo">
    <h3>Button Demo</h3>
    <pt-button plain>朴素按钮</pt-button>
    <pt-button type="primary" round>圆角按钮</pt-button>
    <pt-button type="success" disabled>禁用按钮</pt-button>
    <pt-button type="danger">Primary</pt-button>
    <pt-button type="warning">Success</pt-button>
    <pt-button type="info">Success</pt-button>
  </div>
</template>

<script>
export default { name: 'buttonDemo' };
</script>

<style scoped>
.demo {
  padding: 12px;
}
</style>
