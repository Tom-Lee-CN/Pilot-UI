<template>
  <transition name="pilot-fade-in">
    <div v-if="visible" :style="backtopStyle" class="pilot-backtop" @click.stop="handleClick">
      <slot> <PilotIcon name="caret-top" /></slot>
    </div>
  </transition>
</template>

<script>
import PilotIcon from '../Icon/icon.vue';

export default {
  name: 'PilotBacktop',

  components: {
    PilotIcon,
  },

  props: {
    /**
     * @description 触发滚动的对象。应为一个 CSS 选择器字符串。
     * @type {String}
     */
    target: {
      type: String,
      default: '',
    },
    /**
     * @description 滚动高度达到此值时才显示返回顶部按钮。
     * @type {Number}
     */
    visibilityHeight: {
      type: Number,
      default: 200,
    },
    /**
     * @description 按钮距离页面底部的距离。
     * @type {Number}
     */
    bottom: {
      type: Number,
      default: 40,
    },
    /**
     * @description 按钮距离页面右侧的距离。
     * @type {Number}
     */
    right: {
      type: Number,
      default: 40,
    },
  },

  data() {
    return {
      // 控制按钮是否可见
      visible: false,
      // 节流后的滚动事件处理器
      throttledScrollHandler: null,
    };
  },

  computed: {
    // 计算返回顶部按钮的动态样式
    backtopStyle() {
      return {
        right: `${this.right}px`,
        bottom: `${this.bottom}px`,
      };
    },
  },

  mounted() {
    // 使用节流函数优化滚动事件的触发频率
    this.throttledScrollHandler = this.throttle(this.handleScroll, 200);
    // 为滚动容器添加滚动事件监听
    this.getScrollContainer().addEventListener('scroll', this.throttledScrollHandler);
  },

  beforeUnmount() {
    // 在组件卸载前移除滚动事件监听，防止内存泄漏
    this.getScrollContainer().removeEventListener('scroll', this.throttledScrollHandler);
  },

  methods: {
    /**
     * @description 获取滚动容器的 DOM 元素。
     * @returns {HTMLElement|Window} 如果提供了 target prop，则返回对应的元素，否则返回 window。
     */
    getScrollContainer() {
      return this.target ? document.querySelector(this.target) : window;
    },
    /**
     * @description 处理滚动事件，判断是否显示按钮。
     */
    handleScroll() {
      const scrollTop = this.getScrollTop();
      this.visible = scrollTop >= this.visibilityHeight;
    },

    /**
     * @description 获取当前滚动容器的滚动距离。
     * @returns {Number}
     */
    getScrollTop() {
      const container = this.getScrollContainer();
      if (this.target) {
        return container.scrollTop;
      }
      // 兼容不同的浏览器获取滚动距离的方式
      return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    },

    /**
     * @description 处理按钮的点击事件。
     * @param {MouseEvent} e - 点击事件对象。
     */
    handleClick(e) {
      this.scrollToTop();
      this.$emit('click', e);
    },

    /**
     * @description 执行平滑滚动到顶部的动画。
     */
    scrollToTop() {
      const from = this.getScrollTop();
      const to = 0;
      const duration = 300; // 动画持续时间
      let start = null;

      // 使用 requestAnimationFrame 实现平滑滚动动画
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const nextScrollTop = from + ((to - from) * progress) / duration;

        if (progress < duration) {
          this.setScrollTop(Math.min(nextScrollTop, from));
          window.requestAnimationFrame(step);
        } else {
          this.setScrollTop(to);
        }
      };
      window.requestAnimationFrame(step);
    },

    /**
     * @description 设置滚动容器的滚动距离。
     * @param {Number} scrollTop - 目标滚动距离。
     */
    setScrollTop(scrollTop) {
      const container = this.getScrollContainer();
      if (this.target) {
        container.scrollTop = scrollTop;
      } else {
        document.documentElement.scrollTop = scrollTop;
        document.body.scrollTop = scrollTop;
      }
    },
    /**
     * @description 一个简单的节流函数。
     * @param {Function} fn - 需要节流的函数。
     * @param {Number} delay - 延迟时间（毫秒）。
     * @returns {Function} - 经过节流处理的函数。
     */
    throttle(fn, delay) {
      let timer = null;
      return function (...args) {
        if (!timer) {
          timer = setTimeout(() => {
            fn.apply(this, args);
            timer = null;
          }, delay);
        }
      };
    },
  },
};
</script>
<style lang="scss">
.pilot-backtop {
  position: fixed; // 新增：这是让 right 和 bottom 生效的关键
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgb(182, 182, 182);
  cursor: pointer;
  z-index: 100; // 新增：确保组件在顶层

  &:hover {
    background-color: #f2f6fc;
  }

  .pilot-icon {
    font-size: 20px;
    color: #409eff;
  }
}

.pilot-fade-in-enter-active,
.pilot-fade-in-leave-active {
  transition: opacity 0.3s ease;
}

.pilot-fade-in-enter-from,
.pilot-fade-in-leave-to {
  opacity: 0;
}
</style>
