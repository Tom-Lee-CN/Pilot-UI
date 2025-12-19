<template>
  <transition name="message-fade" @before-leave="onClose" @after-leave="$emit('destroy')">
    <div
      v-if="visible"
      :class="['message', `message--${type}`]"
      :style="{ top: `${offsetValue}px` }"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <PilotIcon :name="iconName" size="16" class="message__icon" />
      <p class="message__content">{{ message }}</p>
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
    id: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'info',
    },
    duration: {
      type: Number,
      default: 3000,
    },
    showClose: {
      type: Boolean,
      default: false,
    },
    offset: {
      type: Number,
      default: 20,
    },
    onClose: {
      type: Function,
      required: true,
    },
  },
  emits: ['destroy'],
  data() {
    return {
      visible: false,
      offsetValue: this.offset,
      timer: null,
    };
  },
  computed: {
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
  mounted() {
    this.startTimer();
  },
  beforeUnmount() {
    this.clearTimer();
  },
  methods: {
    close() {
      this.visible = false;
    },
    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          this.close();
        }, this.duration);
      }
    },
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
