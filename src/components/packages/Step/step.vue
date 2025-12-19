<template>
  <div class="pilot-step" :style="stepStyle" :class="['is-' + currentStatus]">
    <!-- 头部：包含图标和连接线 -->
    <div class="pilot-step__head">
      <div class="pilot-step__icon" :class="['is-' + (icon ? 'icon' : 'text')]">
        <!-- 默认图标：显示数字或对勾 -->
        <slot v-if="currentStatus !== 'success' && currentStatus !== 'error'" name="icon">
          <div v-if="!icon" class="pilot-step__icon-inner">{{ index + 1 }}</div>
          <i v-else :class="['pilot-icon-' + icon]"></i>
        </slot>
        <!-- 状态图标 -->
        <i
          v-else
          :class="['pilot-icon-' + (currentStatus === 'success' ? 'check' : 'close')]"
          class="pilot-step__status-icon"
        ></i>
      </div>
      <!-- 连接线 -->
      <div class="pilot-step__line">
        <i class="pilot-step__line-inner"></i>
      </div>
    </div>
    <!-- 主体：包含标题和描述 -->
    <div class="pilot-step__main">
      <div class="pilot-step__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="!isSimple" class="pilot-step__description">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PilotStep',
  props: {
    title: String,
    icon: String,
    description: String,
    status: String,
  },
  inject: ['steps', 'stepsProps'],
  data() {
    return {
      index: -1,
      currentStatus: '',
    };
  },
  computed: {
    isSimple() {
      return this.stepsProps.simple;
    },
    stepStyle() {
      const style = {
        flexBasis: 100 / this.steps.length + '%',
      };
      // For simple mode, the last step's title should not overflow
      if (this.isSimple && this.index === this.steps.length - 1) {
        style.maxWidth = 100 / this.steps.length + '%';
      }
      return style;
    },
  },
  created() {
    this.index = this.steps.length;
    this.steps.push(this);
  },
  mounted() {
    this.updateStatus();
  },
  beforeUnmount() {
    const index = this.steps.indexOf(this);
    if (index >= 0) {
      this.steps.splice(index, 1);
    }
  },
  watch: {
    'stepsProps.active': {
      handler() {
        this.updateStatus();
      },
      immediate: true,
    },
  },
  methods: {
    updateStatus() {
      const activeIndex = this.stepsProps.active;

      if (this.index < activeIndex) {
        this.currentStatus = this.stepsProps.finishStatus;
      } else if (this.index === activeIndex) {
        this.currentStatus = this.stepsProps.processStatus;
      } else {
        this.currentStatus = 'wait';
      }

      // Allow overriding status via prop
      if (this.status) {
        this.currentStatus = this.status;
      }

      // Manually trigger status update for siblings to update their lines
      if (this.index > 0) {
        this.steps[this.index - 1].updateStatus();
      }
    },
  },
};
</script>

<style lang="scss">
.pilot-step {
  position: relative;
  flex: 1;

  // The last step should not have a line and should not expand
  &:last-child {
    .pilot-step__line {
      display: none;
    }
    flex-grow: 0;
    flex-shrink: 0;
  }

  .pilot-step__head {
    position: relative;
    display: flex;
    align-items: center;
  }

  .pilot-step__icon {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    box-sizing: border-box;
    background: #fff;
    transition:
      background-color 0.3s,
      border-color 0.3s;

    &.is-text {
      border-radius: 50%;
      border: 2px solid #c0c4cc;
      color: #c0c4cc;
    }

    .pilot-step__status-icon {
      font-size: 16px;
      color: #fff;
    }
  }

  .pilot-step__line {
    position: absolute;
    top: 50%;
    left: 24px; // Start after the icon
    right: 0;
    height: 2px;
    transform: translateY(-50%);
    background-color: #e4e7ed;
    overflow: hidden;
  }

  .pilot-step__line-inner {
    display: block;
    width: 0;
    height: 100%;
    background-color: #409eff;
    transition: width 0.3s ease-in-out;
  }

  .pilot-step__main {
    margin-top: 8px;
    text-align: left;
  }

  .pilot-step__title {
    font-size: 16px;
    font-weight: 400;
    color: #c0c4cc;
    transition: color 0.3s;
  }

  .pilot-step__description {
    font-size: 12px;
    margin-top: 2px;
    color: #c0c4cc;
    transition: color 0.3s;
  }

  // --- Status Styling ---

  // Finished Status
  &.is-finish,
  &.is-success {
    .pilot-step__icon {
      border-color: #409eff;
      background-color: #409eff;
    }
    .pilot-step__line-inner {
      width: 100%;
    }
    .pilot-step__title,
    .pilot-step__description {
      color: #303133;
    }
  }

  // Processing Status
  &.is-process {
    .pilot-step__icon {
      border-color: #409eff;
      background-color: #409eff;
      color: #fff;
    }
    .pilot-step__title {
      color: #303133;
      font-weight: 700;
    }
    .pilot-step__description {
      color: #303133;
    }
  }

  // --- Simple Mode ---
  .pilot-steps.is-simple & {
    flex-basis: auto !important;
    flex-shrink: 0;
    margin-right: 20px;

    .pilot-step__main {
      margin-top: 0;
      position: relative;
      top: -2px;
    }
    .pilot-step__description {
      display: none;
    }
    .pilot-step__line {
      left: 16px;
      right: -12px;
    }
  }
}
</style>
