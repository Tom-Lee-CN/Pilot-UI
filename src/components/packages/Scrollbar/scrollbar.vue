<template>
  <!-- 滚动条组件的根元素 -->
  <div class="pilot-scrollbar">
    <!-- 内部包裹容器，用于产生原生滚动条 -->
    <div
      ref="wrap"
      class="pilot-scrollbar__wrap"
      :class="wrapClass"
      :style="mergedWrapStyle"
      @scroll="handleScroll"
    >
      <!-- 内容视图区域，可以是任何 HTML 标签 -->
      <component
        :is="tag"
        ref="resize"
        class="pilot-scrollbar__view"
        :class="viewClass"
        :style="viewStyle"
      >
        <!-- 插槽，用于放置需要滚动的内容 -->
        <slot></slot>
      </component>
    </div>
    <!-- 垂直滚动条轨道 -->
    <div
      v-show="sizeHeight"
      ref="barY"
      class="pilot-scrollbar__bar is-vertical"
      @mousedown="clickTrackHandler($event, false)"
    >
      <!-- 垂直滚动条滑块 -->
      <div
        ref="thumbY"
        class="pilot-scrollbar__thumb"
        :style="{ height: sizeHeight, transform: `translateY(${moveY}%)` }"
        @mousedown.stop="clickThumbHandler($event, false)"
      ></div>
    </div>
    <!-- 水平滚动条轨道 -->
    <div
      v-show="sizeWidth"
      ref="barX"
      class="pilot-scrollbar__bar is-horizontal"
      @mousedown="clickTrackHandler($event, true)"
    >
      <!-- 水平滚动条滑块 -->
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
// 用于缓存浏览器原生滚动条宽度的变量
let scrollbarWidth;

// 计算并返回浏览器原生滚动条宽度的工具函数
const getScrollbarWidth = () => {
  // 如果已经计算过，则直接返回缓存的值
  if (scrollbarWidth !== undefined) return scrollbarWidth;

  // 创建一个外部容器
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden'; // 不可见
  outer.style.width = '100px'; // 设置宽度
  outer.style.position = 'absolute'; // 脱离文档流
  outer.style.top = '-9999px'; // 移出视口
  document.body.appendChild(outer);

  // 记录没有滚动条时的宽度
  const widthNoScroll = outer.offsetWidth;
  // 强制显示滚动条
  outer.style.overflow = 'scroll';

  // 创建一个内部容器
  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  // 记录有滚动条时，内部容器的宽度
  const widthWithScroll = inner.offsetWidth;
  // 从 DOM 中移除临时创建的元素
  outer.parentNode.removeChild(outer);
  // 计算差值，即为滚动条的宽度
  scrollbarWidth = widthNoScroll - widthWithScroll;

  return scrollbarWidth;
};

// 配置对象，用于映射垂直和水平滚动条的通用属性，以减少代码重复
const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight', // 尺寸属性 (高度)
    scroll: 'scrollTop', // 滚动距离属性
    scrollSize: 'scrollHeight', // 总滚动尺寸属性
    size: 'height', // 尺寸样式名
    key: 'vertical', // 键名
    axis: 'Y', // 轴向
    client: 'clientY', // 鼠标事件中的坐标属性
    direction: 'top', // getBoundingClientRect 中的方向属性
  },
  horizontal: {
    offset: 'offsetWidth', // 尺寸属性 (宽度)
    scroll: 'scrollLeft', // 滚动距离属性
    scrollSize: 'scrollWidth', // 总滚动尺寸属性
    size: 'width', // 尺寸样式名
    key: 'horizontal', // 键名
    axis: 'X', // 轴向
    client: 'clientX', // 鼠标事件中的坐标属性
    direction: 'left', // getBoundingClientRect 中的方向属性
  },
};

export default {
  name: 'PilotScrollbar',
  props: {
    // 滚动条容器的高度
    height: [String, Number],
    // 滚动条容器的最大高度
    maxHeight: [String, Number],
    // 是否使用原生滚动条，为 true 时，则不隐藏原生滚动条
    native: Boolean,
    // 包裹容器的自定义样式
    wrapStyle: [String, Object],
    // 包裹容器的自定义类名
    wrapClass: [String, Array],
    // 视图区域的自定义类名
    viewClass: [String, Array],
    // 视图区域的自定义样式
    viewStyle: [String, Object],
    // 如果为 true，则不监听内容区域的尺寸变化
    noresize: Boolean,
    // 视图区域的 HTML 标签名
    tag: {
      type: String,
      default: 'div',
    },
  },
  emits: ['scroll'], // 定义 'scroll' 事件
  data() {
    return {
      sizeWidth: '0', // 水平滑块的宽度 (百分比字符串)
      sizeHeight: '0', // 垂直滑块的高度 (百分比字符串)
      moveX: 0, // 水平滑块的位移 (百分比)
      moveY: 0, // 垂直滑块的位移 (百分比)
      barStore: {}, // 存储拖动开始时的一些信息
      cursorDown: false, // 标记鼠标是否在滑块上按下
      draggingAxis: null, // 标记当前正在拖动的轴 ('horizontal' 或 'vertical')
      resizeObserver: null, // ResizeObserver 实例，用于监听尺寸变化
    };
  },
  computed: {
    // 合并计算包裹容器的最终样式
    mergedWrapStyle() {
      // 从用户传入的 wrapStyle 开始
      const style = { ...this.wrapStyle };

      // 正确处理 height 和 maxHeight prop，统一为字符串格式
      if (this.height) {
        style.height = typeof this.height === 'number' ? `${this.height}px` : this.height;
      }
      if (this.maxHeight) {
        style.maxHeight =
          typeof this.maxHeight === 'number' ? `${this.maxHeight}px` : this.maxHeight;
      }

      // 如果是原生模式，直接返回样式
      if (this.native) {
        return style;
      }

      // 核心技巧：通过负 margin 将原生滚动条推出可视区域
      const gutter = `-${getScrollbarWidth()}px`;
      style.marginRight = gutter; // 隐藏垂直滚动条
      style.marginBottom = gutter; // 隐藏水平滚动条

      return style;
    },
  },
  methods: {
    // 处理原生滚动事件
    handleScroll() {
      const wrap = this.$refs.wrap;
      if (!wrap) return;

      // 根据滚动距离的百分比，计算并更新模拟滑块的位置
      this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight;
      this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth;

      // 触发 'scroll' 事件，并传递滚动信息
      this.$emit('scroll', {
        scrollTop: wrap.scrollTop,
        scrollLeft: wrap.scrollLeft,
      });
    },

    // 更新滚动条状态（主要是滑块的尺寸）
    update() {
      const wrap = this.$refs.wrap;
      if (!wrap) return;

      // 计算可见区域相对于总内容区域的百分比
      const heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight;
      const widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth;

      // 如果百分比小于100，说明内容溢出了，需要显示滚动条，并设置滑块尺寸
      // 否则设置为空字符串，v-show 会将其隐藏
      this.sizeHeight = heightPercentage < 100 ? `${heightPercentage}%` : '';
      this.sizeWidth = widthPercentage < 100 ? `${widthPercentage}%` : '';
    },

    // 处理滑块的 mousedown 事件
    clickThumbHandler(e, isHorizontal) {
      // 忽略 Ctrl 键点击或鼠标右键点击
      if (e.ctrlKey || e.button === 2) return;

      const axis = isHorizontal ? 'horizontal' : 'vertical';
      const barConfig = BAR_MAP[axis];

      // 开始拖动
      this.startDrag(e, axis);

      // 记录鼠标在滑块内的初始位置，用于后续计算
      this.barStore[barConfig.axis] =
        e.currentTarget[barConfig.offset] -
        (e[barConfig.client] - e.currentTarget.getBoundingClientRect()[barConfig.direction]);
    },

    // 处理滚动条轨道的 mousedown 事件
    clickTrackHandler(e, isHorizontal) {
      const axis = isHorizontal ? 'horizontal' : 'vertical';
      const barConfig = BAR_MAP[axis];
      const thumb = isHorizontal ? this.$refs.thumbX : this.$refs.thumbY;
      const bar = isHorizontal ? this.$refs.barX : this.$refs.barY;
      const wrap = this.$refs.wrap;

      // 确保点击的是轨道本身，而不是滑块
      if (!thumb || !bar || e.target !== bar) return;

      // 计算鼠标点击位置在轨道内的偏移量
      const offset = Math.abs(
        e.target.getBoundingClientRect()[barConfig.direction] - e[barConfig.client],
      );
      // 滑块的一半尺寸
      const thumbHalf = thumb[barConfig.offset] / 2;
      // 计算滑块中心应移动到的位置百分比
      const thumbPositionPercentage = ((offset - thumbHalf) * 100) / bar[barConfig.offset];

      // 根据百分比计算并设置内容的滚动位置
      wrap[barConfig.scroll] = (thumbPositionPercentage * wrap[barConfig.scrollSize]) / 100;
    },

    // 开始拖动滑块的准备工作
    startDrag(e, axis) {
      e.stopImmediatePropagation(); // 阻止事件冒泡，特别是对轨道的 mousedown
      this.cursorDown = true; // 标记鼠标已按下
      this.draggingAxis = axis; // 记录正在拖动的轴
      // 在 document 上添加全局事件监听器
      document.addEventListener('mousemove', this.mouseMoveDocumentHandler, false);
      document.addEventListener('mouseup', this.mouseUpDocumentHandler, false);
      // 阻止拖动时选中文本
      document.onselectstart = () => false;
    },

    // 处理 document 上的 mousemove 事件
    mouseMoveDocumentHandler(e) {
      // 如果鼠标未按下，则不处理
      if (this.cursorDown === false) return;

      const barConfig = BAR_MAP[this.draggingAxis];
      const prevPage = this.barStore[barConfig.axis];
      if (!prevPage) return;

      const isHorizontal = this.draggingAxis === 'horizontal';
      const bar = isHorizontal ? this.$refs.barX : this.$refs.barY;
      const thumb = isHorizontal ? this.$refs.thumbX : this.$refs.thumbY;
      const wrap = this.$refs.wrap;

      // 计算鼠标相对于轨道起点的偏移量
      const offset = (bar.getBoundingClientRect()[barConfig.direction] - e[barConfig.client]) * -1;
      // 鼠标在滑块内的点击位置
      const thumbClickPosition = thumb[barConfig.offset] - prevPage;
      // 计算滑块应该移动到的位置百分比
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100) / bar[barConfig.offset];
      // 根据百分比更新内容的滚动位置
      wrap[barConfig.scroll] = (thumbPositionPercentage * wrap[barConfig.scrollSize]) / 100;
    },

    // 处理 document 上的 mouseup 事件，用于结束拖动
    mouseUpDocumentHandler() {
      this.cursorDown = false; // 重置鼠标按下状态
      this.draggingAxis = null; // 清空拖动轴
      this.barStore = {}; // 清空拖动信息
      // 移除全局事件监听器
      document.removeEventListener('mousemove', this.mouseMoveDocumentHandler, false);
      document.removeEventListener('mouseup', this.mouseUpDocumentHandler, false);
      // 恢复文本选择
      document.onselectstart = null;
    },
  },
  mounted() {
    // 如果不是原生模式，则进行初始化
    if (!this.native) {
      // 在下一帧更新滚动条状态，确保 DOM 已经渲染
      this.$nextTick(this.update);
      // 如果允许监听尺寸变化
      if (!this.noresize) {
        // 创建 ResizeObserver 实例
        this.resizeObserver = new ResizeObserver(this.update);
        // 监听内容区域和包裹容器的尺寸变化
        this.resizeObserver.observe(this.$refs.resize);
        this.resizeObserver.observe(this.$refs.wrap);
      }
    }
  },
  beforeUnmount() {
    // 在组件卸载前，断开 ResizeObserver 的监听，防止内存泄漏
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    // 清理可能存在的全局事件监听器
    this.mouseUpDocumentHandler();
  },
};
</script>

<style lang="scss">
.pilot-scrollbar {
  overflow: hidden; // 隐藏被负 margin 推出去的原生滚动条
  position: relative;
  height: 100%;
  flex: 1; // 允许组件在 flex 布局中自适应
  min-height: 0; // 在 flex 布局中，防止内容溢出时撑开容器

  &__wrap {
    overflow-y: scroll; // 产生原生滚动能力
    height: 100%;
  }

  &__bar {
    position: absolute;
    right: 2px;
    bottom: 2px;
    z-index: 1;
    border-radius: 4px;
    opacity: 0; // 默认透明
    transition: opacity 0.12s ease-out; // 设置透明度过渡效果

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

  // 当鼠标悬停、聚焦或激活滚动条组件时，显示模拟滚动条
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
    border-radius: inherit; // 继承轨道的圆角
    background-color: rgba(144, 147, 153, 0.3); // 滑块默认颜色
    transition: background-color 0.3s; // 设置背景色过渡效果

    &:hover {
      background-color: rgba(144, 147, 153, 0.5); // 滑块悬停颜色
    }
  }
}
</style>
