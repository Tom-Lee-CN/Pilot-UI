<template>
  <transition name="modal-fade">
    <div v-if="modelValue" class="pilot-modal__wrapper" @click.self="handleClose">
      <div class="pilot-modal" :style="{ width: width }">
        <div class="pilot-modal__header">
          <span class="pilot-modal__title">{{ title }}</span>
          <button v-if="showClose" class="pilot-modal__close-btn" @click="handleClose">
            <pilot-icon name="close" />
          </button>
        </div>
        <div class="pilot-modal__body">
          <slot></slot>
        </div>
        <div v-if="$slots.footer" class="pilot-modal__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import PilotIcon from '../Icon/icon.vue';

export default {
  name: 'PilotModal',
  components: {
    PilotIcon,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '提示',
    },
    width: {
      type: String,
      default: '50%',
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    // 是否可以通过点击遮罩层关闭
    closeOnClickModal: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    handleClose() {
      if (this.closeOnClickModal) {
        this.$emit('update:modelValue', false);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.pilot-modal__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--pilot-modal-z-index);
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.pilot-modal {
  background: var(--pilot-color-white);
  border-radius: var(--pilot-modal-border-radius);
  box-shadow: var(--pilot-modal-box-shadow);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;

  &__header {
    padding: var(--pilot-modal-header-padding);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--pilot-border-color-light);
  }

  &__title {
    font-size: var(--pilot-modal-title-font-size);
    font-weight: 500;
    color: var(--pilot-text-color-primary);
  }

  &__close-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: var(--pilot-modal-close-font-size);
    color: var(--pilot-modal-close-color);
    padding: 0;

    &:hover {
      color: var(--pilot-color-primary);
    }
  }

  &__body {
    padding: var(--pilot-modal-body-padding);
    font-size: var(--pilot-modal-content-font-size);
    color: var(--pilot-text-color-regular);
    overflow-y: auto;
  }

  &__footer {
    padding: var(--pilot-modal-footer-padding);
    text-align: right;
    border-top: 1px solid var(--pilot-border-color-light);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity var(--pilot-modal-fade-duration);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
