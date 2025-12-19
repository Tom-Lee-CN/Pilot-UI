<template>
  <div class="pilot-steps" :class="{ 'is-simple': simple }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PilotSteps',
  props: {
    active: {
      type: Number,
      default: 0,
    },
    finishStatus: {
      type: String,
      default: 'finish',
    },
    processStatus: {
      type: String,
      default: 'process',
    },
    simple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      steps: [],
    };
  },
  provide() {
    return {
      steps: this.steps,
      stepsProps: this,
    };
  },
};
</script>

<style lang="scss">
.pilot-steps {
  display: flex;
  width: 100%;
  font-size: 14px;
  line-height: 1.5;

  &.is-simple {
    .pilot-step__main {
      margin-top: -5px;
    }
    .pilot-step__title {
      font-size: 14px;
    }
    .pilot-step__description {
      display: none;
    }
  }
}
</style>
