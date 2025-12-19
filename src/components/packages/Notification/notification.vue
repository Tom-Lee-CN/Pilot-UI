<template>
  <transition name="notification-fade" @before-leave="onClose" @after-leave="onDestroy">
    <div
      v-show="visible"
      :class="['notification', horizontalClass, typeClass]"
      :style="positionStyle"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <!-- 使用容器来包裹图标，以实现稳定的外边距 -->
      <div v-if="iconName" class="notification__icon-container">
        <pilot-icon :name="iconName" :style="{ color: iconColor }" size="24px" />
      </div>
      <div class="notification__group">
        <h2 v-if="title" class="notification__title">{{ title }}</h2>
        <p class="notification__message">{{ message }}</p>
        <div v-if="showClose" class="notification__close" @click.stop="close">
          <span>&times;</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import PilotIcon from '../Icon/icon.vue';

const TypeMap = {
  success: { icon: 'SuccessFilled', color: '#67c23a' },
  warning: { icon: 'WarningFilled', color: '#e6a23c' },
  error: { icon: 'CircleCloseFilled', color: '#f56c6c' },
  info: { icon: 'InfoFilled', color: '#909399' },
};

export default {
  name: 'NotificationComponent',
  components: { PilotIcon },
  props: {
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: '',
      validator: (val) => ['', 'success', 'warning', 'info', 'error'].includes(val),
    },
    icon: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 4500,
    },
    position: {
      type: String,
      default: 'top-right',
      validator: (val) => ['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(val),
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    offset: {
      type: Number,
      default: 0,
    },
    onClose: {
      type: Function,
      default: () => {},
    },
    onDestroy: {
      type: Function,
      default: () => {},
    },
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      timer: null,
      currentOffset: this.offset,
      horizontalOffset: this.position.includes('right') ? '100%' : '-100%',
      isPositioned: false,
      transitionState: 'none',
    };
  },
  computed: {
    horizontalClass() {
      return this.position.includes('right') ? 'right' : 'left';
    },
    verticalProperty() {
      return this.position.startsWith('top') ? 'top' : 'bottom';
    },
    typeClass() {
      return this.type ? `notification--${this.type}` : '';
    },
    iconName() {
      return this.icon || (this.type && TypeMap[this.type]?.icon) || '';
    },
    iconColor() {
      return this.type ? TypeMap[this.type]?.color : '';
    },
    positionStyle() {
      const style = {
        [this.verticalProperty]: `${this.currentOffset}px`,
        transform: `translateX(${this.horizontalOffset})`,
        zIndex: 1000,
      };

      let transition = '';
      if (this.transitionState === 'sliding-in') {
        transition = 'transform 0.3s ease-out';
      } else if (this.transitionState === 'active') {
        transition = 'transform 0.3s ease-out, top 0.3s ease-out, bottom 0.3s ease-out';
      }
      style.transition = transition;

      return style;
    },
  },
  watch: {
    currentOffset() {
      if (!this.isPositioned) {
        this.isPositioned = true;
        this.$nextTick(() => {
          this.transitionState = 'sliding-in';
          this.horizontalOffset = '0%';
          setTimeout(() => {
            this.transitionState = 'active';
          }, 300);
        });
      }
    },
  },
  mounted() {
    this.startTimer();
    this.visible = true;
  },
  beforeUnmount() {
    this.stopTimer();
  },
  methods: {
    close() {
      this.transitionState = 'active';
      this.horizontalOffset = this.horizontalClass === 'right' ? '100%' : '-100%';
      setTimeout(() => {
        this.visible = false;
      }, 300);
    },
    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          this.close();
        }, this.duration);
      }
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    stopTimer() {
      this.clearTimer();
    },
  },
};
</script>

<style lang="scss">
@use '../../../styles/variables.scss' as vars;
@use '../../../styles/mixins.scss' as mixins;

.notification {
  position: fixed;
  width: 330px;
  display: flex;
  align-items: flex-start;
  padding: 14px 26px 14px 13px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  &.right {
    right: 16px;
  }

  &.left {
    left: 16px;
  }

  &__icon-container {
    flex-shrink: 0;
    margin-right: 10px;
    padding-top: 2px; /* 微调图标垂直位置，使其与标题对齐 */
  }

  &__group {
    flex-grow: 1;
    position: relative;
  }

  &__title {
    margin: 0 0 5px 0;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  &__message {
    margin: 0;
    font-size: 14px;
    color: #666;
    line-height: 1.5;
  }

  &__close {
    position: absolute;
    top: -2px;
    right: -10px;
    cursor: pointer;
    color: #999;
    font-size: 20px;

    &:hover {
      color: #333;
    }
  }
}

.notification-fade-enter-active,
.notification-fade-leave-active {
  transition: opacity 0.3s ease;
}

.notification-fade-enter-from,
.notification-fade-leave-to {
  opacity: 0;
}
</style>
