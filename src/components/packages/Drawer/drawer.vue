<template>
  <teleport to="body">
    <!-- 遮罩层动画 -->
    <transition name="drawer-fade">
      <!-- 遮罩层，v-show 控制其显示和隐藏 -->
      <div class="pilot-drawer__modal" v-show="modelValue" @click.self="handleWrapperClick">
        <!-- 抽屉面板动画，根据 direction 动态应用 -->
        <transition :name="`drawer-slide-${direction}`">
          <div class="pilot-drawer" :class="drawerClasses" :style="drawerStyle" v-show="modelValue">
            <!-- 头部 -->
            <div class="pilot-drawer__header">
              <slot name="title">
                <span class="pilot-drawer__title">{{ title }}</span>
              </slot>
              <button class="pilot-drawer__close-btn" @click="handleClose">X</button>
            </div>
            <!-- 内容区 -->
            <div class="pilot-drawer__body">
              <slot></slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'PilotDrawer',
  props: {
    // v-model 绑定值，控制显示/隐藏
    modelValue: {
      type: Boolean,
      default: false,
    },
    // 标题
    title: {
      type: String,
      default: 'Title',
    },
    // 新增：关闭前的回调，会暂停抽屉的关闭
    beforeClose: {
      type: Function,
    },
    // 方向: rtl (从右到左), ltr (从左到右), ttb (从上到下), btt (从下到上)
    direction: {
      type: String,
      default: 'rtl',
      validator: (val) => ['rtl', 'ltr', 'ttb', 'btt'].includes(val),
    },
    // 尺寸 (宽度或高度)
    size: {
      type: [String, Number],
      default: '30%',
    },
    // 是否可点击遮罩层关闭
    closeOnClickModal: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'open', 'close'],
  computed: {
    // 动态计算样式
    drawerStyle() {
      if (this.direction === 'ltr' || this.direction === 'rtl') {
        return { width: this.size };
      } else {
        return { height: this.size };
      }
    },
    // 动态计算 class
    drawerClasses() {
      return [`direction-${this.direction}`];
    },
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.$emit('open');
        // 打开时禁止页面滚动
        document.body.style.overflow = 'hidden';
      } else {
        this.$emit('close');
        // 关闭时恢复页面滚动
        document.body.style.overflow = '';
      }
    },
  },
  methods: {
    // 统一的关闭处理函数
    handleClose() {
      // 如果 beforeClose 存在，则调用它并传入 done 回调
      if (this.beforeClose) {
        this.beforeClose(this.hide);
      } else {
        // 否则直接关闭
        this.hide();
      }
    },
    // 真正执行关闭操作的函数
    hide() {
      this.$emit('update:modelValue', false);
    },
    handleWrapperClick() {
      if (this.closeOnClickModal) {
        this.handleClose();
      }
    },
  },
};
</script>

<style lang="scss">
@use '../../../styles/variables.scss';

.pilot-drawer__modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: var(--pilot-drawer-z-index);
}

.pilot-drawer {
  position: fixed;
  background-color: var(--pilot-drawer-bg-color);
  box-shadow: var(--pilot-drawer-box-shadow);
  display: flex;
  flex-direction: column;
  z-index: var(--pilot-drawer-z-index);

  &.direction-rtl {
    top: 0;
    right: 0;
    height: 100%;
  }

  &.direction-ltr {
    top: 0;
    left: 0;
    height: 100%;
  }

  &.direction-ttb {
    top: 0;
    left: 0;
    width: 100%;
  }

  &.direction-btt {
    bottom: 0;
    left: 0;
    width: 100%;
  }
}

.pilot-drawer__header {
  padding: var(--pilot-drawer-header-padding);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--pilot-border-color-light);

  .pilot-drawer__title {
    font-size: var(--pilot-drawer-title-font-size);
    color: var(--pilot-text-color-primary);
    margin: 0;
  }

  .pilot-drawer__close-btn {
    cursor: pointer;
    font-size: var(--pilot-drawer-close-font-size);
    color: var(--pilot-text-color-secondary);
    border: none;
    background: transparent;
    padding: 0;

    &:hover {
      color: var(--pilot-color-primary);
    }
  }
}

.pilot-drawer__body {
  padding: var(--pilot-drawer-body-padding);
  flex-grow: 1;
  overflow: auto;
}

/* Animations */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity var(--pilot-drawer-animation-duration);
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-rtl-enter-active,
.drawer-slide-rtl-leave-active,
.drawer-slide-ltr-enter-active,
.drawer-slide-ltr-leave-active,
.drawer-slide-ttb-enter-active,
.drawer-slide-ttb-leave-active,
.drawer-slide-btt-enter-active,
.drawer-slide-btt-leave-active {
  transition: transform var(--pilot-drawer-animation-duration) ease;
}

.drawer-slide-rtl-enter-from,
.drawer-slide-rtl-leave-to {
  transform: translateX(100%);
}

.drawer-slide-ltr-enter-from,
.drawer-slide-ltr-leave-to {
  transform: translateX(-100%);
}

.drawer-slide-ttb-enter-from,
.drawer-slide-ttb-leave-to {
  transform: translateY(-100%);
}

.drawer-slide-btt-enter-from,
.drawer-slide-btt-leave-to {
  transform: translateY(100%);
}
</style>
