<template>
  <div class="pilot-scrollbar">
    <div
      ref="wrap"
      class="pilot-scrollbar__wrap"
      :class="wrapClass"
      :style="mergedWrapStyle"
      @scroll="handleScroll"
    >
      <component
        :is="tag"
        ref="resize"
        class="pilot-scrollbar__view"
        :class="viewClass"
        :style="viewStyle"
      >
        <slot></slot>
      </component>
    </div>
    <!-- Vertical Bar -->
    <div
      v-show="sizeHeight"
      ref="barY"
      class="pilot-scrollbar__bar is-vertical"
      @mousedown="clickTrackHandler($event, false)"
    >
      <div
        ref="thumbY"
        class="pilot-scrollbar__thumb"
        :style="{ height: sizeHeight, transform: `translateY(${moveY}%)` }"
        @mousedown.stop="clickThumbHandler($event, false)"
      ></div>
    </div>
    <!-- Horizontal Bar -->
    <div
      v-show="sizeWidth"
      ref="barX"
      class="pilot-scrollbar__bar is-horizontal"
      @mousedown="clickTrackHandler($event, true)"
    >
      <div
        ref="thumbX"
        class="pilot-scrollbar__thumb"
        :style="{ width: sizeWidth, transform: `translateX(${moveX}%)` }"
        @mousedown.stop="clickThumbHandler($event, true)"
      ></div>
    </div>
  </div>
</template>

<script>
let scrollbarWidth;

// Utility to calculate scrollbar width
const getScrollbarWidth = () => {
  if (scrollbarWidth !== undefined) return scrollbarWidth;

  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  scrollbarWidth = widthNoScroll - widthWithScroll;

  return scrollbarWidth;
};

const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
  },
};

export default {
  name: 'PilotScrollbar',
  props: {
    height: [String, Number],
    maxHeight: [String, Number],
    native: Boolean,
    wrapStyle: [String, Object],
    wrapClass: [String, Array],
    viewClass: [String, Array],
    viewStyle: [String, Object],
    noresize: Boolean, // if true, do not listen to resize event
    tag: {
      type: String,
      default: 'div',
    },
  },
  emits: ['scroll'],
  data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0,
      barStore: {},
      cursorDown: false,
      draggingAxis: null, // 'horizontal' or 'vertical'
      resizeObserver: null,
    };
  },
  computed: {
    mergedWrapStyle() {
      const style = { ...this.wrapStyle }; // Start with user-provided styles

      // Correctly handle height and maxHeight props
      if (this.height) {
        style.height = typeof this.height === 'number' ? `${this.height}px` : this.height;
      }
      if (this.maxHeight) {
        style.maxHeight =
          typeof this.maxHeight === 'number' ? `${this.maxHeight}px` : this.maxHeight;
      }

      if (this.native) {
        return style;
      }

      const gutter = `-${getScrollbarWidth()}px`;
      style.marginRight = gutter;
      style.marginBottom = gutter;

      return style;
    },
  },
  methods: {
    handleScroll() {
      const wrap = this.$refs.wrap;
      if (!wrap) return;

      this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight;
      this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth;

      this.$emit('scroll', {
        scrollTop: wrap.scrollTop,
        scrollLeft: wrap.scrollLeft,
      });
    },

    update() {
      const wrap = this.$refs.wrap;
      if (!wrap) return;

      const heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight;
      const widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth;

      this.sizeHeight = heightPercentage < 100 ? `${heightPercentage}%` : '';
      this.sizeWidth = widthPercentage < 100 ? `${widthPercentage}%` : '';
    },

    // Methods for thumb dragging
    clickThumbHandler(e, isHorizontal) {
      if (e.ctrlKey || e.button === 2) return;

      const axis = isHorizontal ? 'horizontal' : 'vertical';
      const barConfig = BAR_MAP[axis];

      this.startDrag(e, axis);

      this.barStore[barConfig.axis] =
        e.currentTarget[barConfig.offset] -
        (e[barConfig.client] - e.currentTarget.getBoundingClientRect()[barConfig.direction]);
    },

    clickTrackHandler(e, isHorizontal) {
      const axis = isHorizontal ? 'horizontal' : 'vertical';
      const barConfig = BAR_MAP[axis];
      const thumb = isHorizontal ? this.$refs.thumbX : this.$refs.thumbY;
      const bar = isHorizontal ? this.$refs.barX : this.$refs.barY;
      const wrap = this.$refs.wrap;

      if (!thumb || !bar || e.target !== bar) return;

      const offset = Math.abs(
        e.target.getBoundingClientRect()[barConfig.direction] - e[barConfig.client],
      );
      const thumbHalf = thumb[barConfig.offset] / 2;
      const thumbPositionPercentage = ((offset - thumbHalf) * 100) / bar[barConfig.offset];

      wrap[barConfig.scroll] = (thumbPositionPercentage * wrap[barConfig.scrollSize]) / 100;
    },

    startDrag(e, axis) {
      e.stopImmediatePropagation();
      this.cursorDown = true;
      this.draggingAxis = axis;
      document.addEventListener('mousemove', this.mouseMoveDocumentHandler, false);
      document.addEventListener('mouseup', this.mouseUpDocumentHandler, false);
      document.onselectstart = () => false;
    },

    mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return;

      const barConfig = BAR_MAP[this.draggingAxis];
      const prevPage = this.barStore[barConfig.axis];
      if (!prevPage) return;

      const isHorizontal = this.draggingAxis === 'horizontal';
      const bar = isHorizontal ? this.$refs.barX : this.$refs.barY;
      const thumb = isHorizontal ? this.$refs.thumbX : this.$refs.thumbY;
      const wrap = this.$refs.wrap;

      const offset = (bar.getBoundingClientRect()[barConfig.direction] - e[barConfig.client]) * -1;
      const thumbClickPosition = thumb[barConfig.offset] - prevPage;
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100) / bar[barConfig.offset];
      wrap[barConfig.scroll] = (thumbPositionPercentage * wrap[barConfig.scrollSize]) / 100;
    },

    mouseUpDocumentHandler() {
      this.cursorDown = false;
      this.draggingAxis = null;
      this.barStore = {};
      document.removeEventListener('mousemove', this.mouseMoveDocumentHandler, false);
      document.removeEventListener('mouseup', this.mouseUpDocumentHandler, false);
      document.onselectstart = null;
    },
  },
  mounted() {
    if (!this.native) {
      this.$nextTick(this.update);
      if (!this.noresize) {
        this.resizeObserver = new ResizeObserver(this.update);
        this.resizeObserver.observe(this.$refs.resize);
        this.resizeObserver.observe(this.$refs.wrap);
      }
    }
  },
  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    // Clean up global event listeners
    this.mouseUpDocumentHandler();
  },
};
</script>

<style lang="scss">
.pilot-scrollbar {
  overflow: hidden;
  position: relative;
  height: 100%;
  flex: 1;
  min-height: 0;

  &__wrap {
    overflow-y: scroll;
    height: 100%;
  }

  &__bar {
    position: absolute;
    right: 2px;
    bottom: 2px;
    z-index: 1;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.12s ease-out;

    &.is-vertical {
      width: 6px;
      top: 2px;
      > div {
        width: 100%;
      }
    }

    &.is-horizontal {
      height: 6px;
      left: 2px;
      > div {
        height: 100%;
      }
    }
  }

  &:hover > &__bar,
  &:focus > &__bar,
  &:active > &__bar {
    opacity: 1;
    transition: opacity 0.34s ease-out;
  }

  &__thumb {
    position: relative;
    display: block;
    width: 0;
    height: 0;
    cursor: pointer;
    border-radius: inherit;
    background-color: rgba(144, 147, 153, 0.3);
    transition: background-color 0.3s;

    &:hover {
      background-color: rgba(144, 147, 153, 0.5);
    }
  }
}
</style>
