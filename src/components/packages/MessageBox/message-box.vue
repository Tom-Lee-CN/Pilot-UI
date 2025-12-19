<template>
  <!-- 遮罩层，覆盖整个页面 -->
  <div class="pilot-message-box__wrapper">
    <!-- 弹窗主体 -->
    <div class="pilot-message-box">
      <!-- 头部区域 -->
      <div class="pilot-message-box__header">
        <!-- 标题 -->
        <div class="pilot-message-box__title">{{ title }}</div>
        <!-- 右上角关闭按钮 -->
        <button
          class="pilot-message-box__headerbtn"
          @click="handleAction('close')"
          v-if="showClose"
        >
          <pilot-icon name="close"></pilot-icon>
        </button>
      </div>
      <!-- 内容区域 -->
      <div class="pilot-message-box__content">
        <p>{{ message }}</p>
      </div>
      <!-- 按钮操作区域 -->
      <div class="pilot-message-box__btns">
        <!-- 取消按钮 -->
        <pilot-button size="small" @click="handleAction('cancel')" v-if="showCancelButton">{{
          cancelButtonText
        }}</pilot-button>
        <!-- 确认按钮 -->
        <pilot-button
          size="small"
          type="primary"
          @click="handleAction('confirm')"
          v-if="showConfirmButton"
          >{{ confirmButtonText }}</pilot-button
        >
      </div>
    </div>
  </div>
</template>

<script>
// 由于 MessageBox 是通过 createApp 动态创建的独立 Vue 实例，
// 它无法访问主应用中全局注册的组件。
// 因此，必须在此处局部导入并注册所有用到的子组件。
import PilotButton from '../Button';
import PilotIcon from '../Icon';

export default {
  name: 'PilotMessageBox',
  // 局部注册子组件
  components: {
    PilotButton,
    PilotIcon,
  },
  props: {
    // 弹窗标题
    title: {
      type: String,
      default: '提示',
    },
    // 弹窗消息内容
    message: {
      type: String,
      default: '',
    },
    // 是否显示确认按钮
    showConfirmButton: {
      type: Boolean,
      default: true,
    },
    // 是否显示取消按钮
    showCancelButton: {
      type: Boolean,
      default: false,
    },
    // 确认按钮的文本
    confirmButtonText: {
      type: String,
      default: '确定',
    },
    // 取消按钮的文本
    cancelButtonText: {
      type: String,
      default: '取消',
    },
    // 是否显示右上角的关闭按钮
    showClose: {
      type: Boolean,
      default: true,
    },
  },
  // 声明组件会触发的事件
  emits: ['action'],
  methods: {
    /**
     * 统一处理所有用户操作（确认、取消、关闭）
     * @param {string} action - 操作类型 ('confirm', 'cancel', 'close')
     */
    handleAction(action) {
      // 触发 action 事件，将操作类型传递给父级（即 index.js 中的调用者）
      this.$emit('action', action);
    },
  },
};
</script>

<style lang="scss">
// 导入全局样式变量，以保持 UI 风格统一
@use '../../../styles/variables.scss';

// 遮罩层样式
.pilot-message-box__wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: $modal-z-index; // 使用变量确保层级正确
}

// 弹窗主体样式
.pilot-message-box {
  width: 420px;
  padding-bottom: 10px;
  vertical-align: middle;
  background-color: $color-white;
  border-radius: $border-radius-base;
  border: 1px solid $border-color-lighter;
  font-size: $font-size-large;
  box-shadow: $box-shadow-base;
  text-align: left;
  overflow: hidden;
  backface-visibility: hidden;
}

// 头部样式
.pilot-message-box__header {
  position: relative;
  padding: 15px 15px 10px;
}

// 标题样式
.pilot-message-box__title {
  padding-left: 0;
  margin-bottom: 0;
  font-size: $font-size-large;
  line-height: 1;
  color: $text-color-primary;
}

// 右上角关闭按钮样式
.pilot-message-box__headerbtn {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
}

// 内容区域样式
.pilot-message-box__content {
  padding: 10px 15px;
  color: $text-color-regular;
  font-size: $font-size-base;
  line-height: $font-line-height-base;
}

// 底部按钮组样式
.pilot-message-box__btns {
  padding: 5px 15px 0;
  text-align: right;

  // 为按钮之间添加左边距
  .pilot-button {
    margin-left: 10px;
  }
}
</style>
