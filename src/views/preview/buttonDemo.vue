<template>
  <div class="demo">
    <h3>Button Demo</h3>
    <pilot-button>Default</pilot-button>
    <pilot-button type="primary">Primary</pilot-button>
    <pilot-button type="success">Success</pilot-button>
    <pilot-button type="danger">Primary</pilot-button>
    <pilot-button type="warning">Success</pilot-button>
    <pilot-button type="info">Success</pilot-button>
  </div>
  <div class="demo">
    <h3>Button Demo</h3>
    <pilot-button size="large">大号按钮</pilot-button>
    <pilot-button type="primary" size="default">中号按钮</pilot-button>
    <pilot-button type="success" size="small">小号按钮</pilot-button>
    <pilot-button type="danger">Primary</pilot-button>
    <pilot-button type="warning">Success</pilot-button>
    <pilot-button type="info">Success</pilot-button>
  </div>
  <div class="demo">
    <h3>Button Demo</h3>
    <pilot-button plain>朴素按钮</pilot-button>
    <pilot-button type="primary" round>圆角按钮</pilot-button>
    <pilot-button type="success" disabled>禁用按钮</pilot-button>
    <pilot-button type="danger">Primary</pilot-button>
    <pilot-button type="warning">Success</pilot-button>
    <pilot-button type="info">Success</pilot-button>
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
