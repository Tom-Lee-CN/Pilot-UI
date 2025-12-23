<template>
  <div class="demo-block">
    <h2 class="demo-title">Message 消息提示</h2>
    <p class="demo-desc">
      常用于主动操作后的反馈提示。与 Notification 的区别是，Message
      更轻量，只提供消息内容，没有标题。
    </p>
  </div>
  <div class="demo-block">
    <h3 class="demo-title">基础用法</h3>
    <p class="demo-desc">提供 success, warning, info, error 四种类型。</p>
    <div class="demo-display">
      <pt-button @click="openMessage('info')" size="large">消息</pt-button>
      <pt-button type="success" @click="openMessage('success')" size="small">成功</pt-button>
      <pt-button type="warning" @click="openMessage('warning')">警告</pt-button>
      <pt-button type="danger" @click="openMessage('error')">错误</pt-button>
    </div>
  </div>
  <div class="demo-block">
    <h3 class="demo-title">可关闭的消息</h3>
    <p class="demo-desc">可以添加一个关闭按钮。</p>
    <div class="demo-display">
      <pt-button @click="openClosableMessage">可关闭的消息</pt-button>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';

export default {
  name: 'MessageDemo',
  setup() {
    // 由于 Message 已经全局挂载，我们可以通过 getCurrentInstance 获取它
    const { appContext } = getCurrentInstance();
    const $message = appContext.config.globalProperties.$message;

    const openMessage = (type) => {
      $message[type](`这是一个 ${type} 消息提示`);
    };

    const openClosableMessage = () => {
      $message({
        message: '这是一个可关闭的消息',
        type: 'info',
        showClose: true,
        duration: 0, // 设置为0，消息不会自动关闭
      });
    };

    return {
      openMessage,
      openClosableMessage,
    };
  },
};
</script>

<style scoped>
.demo-display {
  display: flex;
  gap: 16px;
}
</style>
