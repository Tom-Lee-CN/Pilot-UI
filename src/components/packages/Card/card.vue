<template>
  <div class="pilot-card" :class="`is-${shadow}-shadow`">
    <div v-if="$slots.header || header" class="pilot-card__header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="pilot-card__body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="pilot-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PilotCard',
  props: {
    header: {
      type: String,
      default: '',
    },
    shadow: {
      type: String,
      default: 'always', // always, hover, never
    },
  },
};
</script>
<style scoped lang="scss">
.pilot-card {
  border: $border-width-base solid var(--pilot-border-color-light);
  border-radius: $card-border-radius;
  background-color: var(--pilot-fill-color-blank);
  overflow: hidden;
  color: var(--pilot-text-color-primary);
  transition: 0.3s;
  &.is-always-shadow {
    box-shadow: $card-box-shadow;
  }
  &.is-hover-shadow:hover {
    box-shadow: $card-box-shadow;
  }
  &__header {
    padding: $card-header-padding-y $card-header-padding-x;
    border-bottom: $border-width-base solid var(--pilot-border-color-light);
    box-sizing: border-box;
  }
  &__body {
    padding: $card-padding;
  }
  &__footer {
    padding: $card-header-padding-y $card-header-padding-x;
    border-top: 1px solid var(--pilot-border-color-light);
    box-sizing: border-box;
  }
}
</style>
