<template>
  <transition name="pilot-alert-fade" @after-leave="handleAfterLeave">
    <div
      v-if="visible"
      class="pilot-alert"
      :class="[typeClass, { 'is-center': center }]"
      :style="alertStyle"
      role="alert"
    >
      <pilot-icon v-if="showIcon" class="pilot-alert__icon" :name="iconClass" />
      <div class="pilot-alert__content">
        <span class="pilot-alert__title" :class="{ 'is-bold': description }">{{ title }}</span>
        <p v-if="description" class="pilot-alert__description">{{ description }}</p>
        <i v-if="closable" class="pilot-alert__close-btn" @click="close">
          <pilot-icon name="close" />
        </i>
      </div>
    </div>
  </transition>
</template>
<script>
import pilotIcon from '../Icon/icon.vue';

// 定义不同类型 alert 对应的图标名称
const TYPE_CLASSES_MAP = {
  success: 'success-filled',
  warning: 'warning-filled',
  danger: 'circle-close-filled',
  info: 'info-filled',
};
export default {
  name: 'PilotAlert',
  components: {
    pilotIcon,
  },
  props: {
    /**
     * @description 警告框的标题
     * @type {String}
     */
    title: { type: String, default: '' },
    /**
     * @description 辅助性描述文字
     * @type {String}
     */
    description: { type: String, default: '' },
    /**
     * @description 指定警告框的类型
     * @type {String}
     * @enum {'success', 'warning', 'info', 'danger'}
     */
    type: { type: String, default: 'info' },
    /**
     * @description 是否可以关闭
     * @type {Boolean}
     */
    closable: { type: Boolean, default: false },
    /**
     * @description 文字是否居中
     * @type {Boolean}
     */
    center: { type: Boolean, default: false },
    /**
     * @description 是否显示图标
     * @type {Boolean}
     */
    showIcon: { type: Boolean, default: false },
    /**
     * @description 自定义宽度，单位为px或百分比
     * @type {String | Number}
     */
    width: {
      type: [String, Number],
      default: '',
    },
    /**
     * @description 自定义高度，单位为px或百分比
     * @type {String | Number}
     */
    height: {
      type: [String, Number],
      default: '',
    },
  },
  emits: ['close'],
  data() {
    return {
      // 控制警告框是否可见
      visible: true,
    };
  },

  computed: {
    // 根据 type 计算出对应的 CSS 类名
    typeClass() {
      return `pilot-alert--${this.type}`;
    },
    // 根据 type 计算出对应的图标类名
    iconClass() {
      return TYPE_CLASSES_MAP[this.type];
    },
    // 计算 alert 的样式
    alertStyle() {
      const style = {};
      if (this.width) {
        style.width = typeof this.width === 'number' ? `${this.width}px` : this.width;
      }
      if (this.height) {
        style.height = typeof this.height === 'number' ? `${this.height}px` : this.height;
      }
      return style;
    },
  },
  methods: {
    // 关闭警告框
    close() {
      this.visible = false; // 隐藏 alert，触发过渡
    },
    handleAfterLeave() {
      this.$emit('close'); // 在动画结束后再发出 close 事件
    },
  },
};
</script>
<style scoped lang="scss">
@use '../../../styles/mixins' as *;

.pilot-alert {
  width: 100%;
  padding: $alert-padding-y $alert-padding-x;
  margin: 0;
  border-radius: $alert-border-radius;
  position: relative;
  background-color: var(--pilot-fill-color-blank);
  overflow: hidden;
  opacity: 1;
  display: flex;
  align-items: center;

  &.is-center {
    justify-content: center;
  }

  &--success {
    @include alert-variant($success-color);
  }
  &--warning {
    @include alert-variant($warning-color);
  }
  &--info {
    @include alert-variant($info-color);
  }
  &--danger {
    @include alert-variant($danger-color);
  }
  &__icon {
    font-size: $alert-icon-size;
    width: $alert-icon-size;
    margin-right: $alert-icon-margin-right;
  }
  &__content {
    display: table-cell;
    padding: 0 8px;
    width: 100%;
  }
  &__title {
    font-size: $alert-title-font-size;
    line-height: 18px;
    display: block;
    margin-bottom: 0.1rem;
    &.is-bold {
      font-weight: bold;
    }
  }
  &__description {
    font-size: $alert-description-font-size;
    margin: 5px 0 0 0;
  }
  &__close-btn {
    font-size: $alert-close-font-size;
    position: absolute;
    top: 12px;
    right: 15px;
    cursor: pointer;

    .pilot-icon {
      font-size: 1em;
    }
  }

  p {
    margin: 0;
    margin-bottom: 0.2rem;
  }
}

.pilot-alert-fade-enter-active,
.pilot-alert-fade-leave-active {
  transition: opacity 0.5s ease;
}
.pilot-alert-fade-enter-from,
.pilot-alert-fade-leave-to {
  opacity: 0;
}
</style>
