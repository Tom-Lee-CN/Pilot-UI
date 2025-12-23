<template>
  <transition name="message-fade" @before-leave="onClose" @after-leave="$emit('destroy')">
    <!-- 消息主体，v-if 控制 DOM 的创建和销毁 -->
    <div
      v-if="visible"
      :class="['message', `message--${type}`]"
      :style="{ top: `${offsetValue}px` }"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <!-- 消息图标 -->
      <PilotIcon :name="iconName" size="16" class="message__icon" />
      <!-- 消息文本内容 -->
      <p class="message__content">{{ message }}</p>
      <!-- 关闭按钮，v-if 控制是否显示 -->
      <PilotIcon v-if="showClose" name="close" size="16" class="message__close" @click="close" />
    </div>
  </transition>
</template>

<script>
import PilotIcon from '../Icon';
export default {
  name: 'Message',
  components: { PilotIcon },
  props: {
    // 消息的唯一标识
    id: {
      type: String,
      default: '',
    },
    // 消息文本
    message: {
      type: String,
      default: '',
    },
    // 消息类型 (info, success, warning, error)
    type: {
      type: String,
      default: 'info',
    },
    // 显示时长，单位毫秒。为 0 则不自动关闭
    duration: {
      type: Number,
      default: 3000,
    },
    // 是否显示关闭按钮
    showClose: {
      type: Boolean,
      default: false,
    },
    // 初始的垂直偏移量
    offset: {
      type: Number,
      default: 20,
    },
    // 关闭时触发的回调函数，由 message.js 传入
    onClose: {
      type: Function,
      required: true,
    },
  },
  // 声明组件会触发的自定义事件
  emits: ['destroy'],
  data() {
    return {
      // 控制消息的显示/隐藏状态
      visible: false,
      // 内部维护的偏移量，用于后续的位置调整
      offsetValue: this.offset,
      // 计时器引用
      timer: null,
    };
  },
  computed: {
    // 根据消息类型计算对应的图标名称
    iconName() {
      const iconMap = {
        success: 'success-filled',
        warning: 'warning-filled',
        info: 'info-filled',
        error: 'circle-close-filled',
      };
      return iconMap[this.type] || 'info-filled';
    },
  },
  // 组件挂载后执行
  mounted() {
    // 启动自动关闭计时器
    this.startTimer();
  },
  // 组件卸载前执行
  beforeUnmount() {
    // 清除计时器，防止内存泄漏
    this.clearTimer();
  },
  methods: {
    // 关闭消息
    close() {
      // 将 visible 设为 false，触发离开动画
      this.visible = false;
    },
    // 启动自动关闭计时器
    startTimer() {
      // 仅当 duration 大于 0 时启动
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          this.close();
        }, this.duration);
      }
    },
    // 清除自动关闭计时器
    clearTimer() {
      clearTimeout(this.timer);
    },
  },
};
</script>

<style lang="scss">
@use '../../../styles/variables.scss';

.message {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  padding: $message-padding;
  border: 1px solid $border-color-lighter;
  border-radius: $message-border-radius;
  background-color: $message-background-color;
  box-shadow: $message-box-shadow;
  display: flex;
  align-items: center;
  transition:
    top 0.4s,
    transform 0.4s,
    opacity 0.4s;

  &--info .message__icon {
    color: $message-info-color;
  }
  &--success .message__icon {
    color: $message-success-color;
  }
  &--warning .message__icon {
    color: $message-warning-color;
  }
  &--error .message__icon {
    color: $message-error-color;
  }
}

.message__icon {
  margin-right: 10px;
  font-style: normal;
  font-size: $message-icon-size;
}

.message__content {
  margin: 0 10px 0 5px;
  color: $text-color-regular;
  font-size: $message-font-size;
}

.message__close {
  margin-left: 10px;
  cursor: pointer;
}

.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.2s ease-in-out;
}

.message-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -10px);
}

.message-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}
</style>
