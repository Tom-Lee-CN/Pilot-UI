// 定义一个唯一的常量作为作用域，用于在 DOM 元素上存储指令的私有状态，避免与其他属性冲突。
const SCOPE = 'PilotInfiniteScroll';

/**
 * 查找并返回真正的滚动容器。
 * @param {HTMLElement} el - 指令所绑定的元素。
 * @returns {HTMLElement|Window} - 滚动的容器元素，或者 window 对象。
 */
const getScrollContainer = (el) => {
  let parent = el;
  while (parent) {
    // 优先检查父元素是否是 pilot-scrollbar 组件的滚动区域，以实现深度集成。
    if (parent.classList.contains('pilot-scrollbar__wrap')) {
      return parent;
    }
    // 如果找到了文档的根节点，说明滚动发生在整个页面上。
    if (parent === document.documentElement || parent === document.body) {
      return window;
    }
    // 检查元素的 computed style，如果 overflow-y 是 'auto' 或 'scroll'，则该元素是滚动容器。
    const { overflowY } = window.getComputedStyle(parent);
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return parent;
    }
    // 继续向上遍历父节点。
    parent = parent.parentNode;
  }
  // 如果没有找到任何滚动容器，则默认为 window。
  return window;
};

/**
 * 滚动事件的核心处理函数。
 * @param {HTMLElement} el - 指令所绑定的元素。
 * @param {object} binding - 指令的绑定对象，包含了传递给指令的值和修饰符。
 */
const handleScroll = (el, binding) => {
  // 从 binding.value 中解构出用户配置的选项。
  const { handler, disabled, delay = 200, distance } = binding.value;

  // 从元素的私有作用域中获取滚动容器。
  const scrollContainer = el[SCOPE].scrollContainer;
  // 如果滚动容器是 window，则实际的滚动元素是 document.documentElement，否则是容器本身。
  const scrollEl = scrollContainer === window ? document.documentElement : scrollContainer;

  // 如果指令被禁用，或者当前正在加载中，则直接返回，防止重复触发。
  if (disabled || el[SCOPE].loading) return;

  // 获取滚动的关键指标。
  const { scrollTop, scrollHeight, clientHeight } = scrollEl;

  // 判断是否滚动到底部的核心逻辑：
  // 当 (滚动内容总高度 - 已滚动高度) <= (可视区域高度 + 预加载距离) 时，触发加载。
  if (scrollHeight - scrollTop <= clientHeight + distance) {
    // 设置加载锁，防止在本次加载完成前再次触发。
    el[SCOPE].loading = true;
    // 使用 setTimeout 实现简易节流，延迟执行加载函数。
    setTimeout(() => {
      // 执行用户传入的加载数据的方法。
      handler();
      // 检查元素是否在加载期间被卸载，如果未卸载，则释放加载锁。
      if (el[SCOPE]) {
        el[SCOPE].loading = false;
      }
    }, delay);
  }
};

// 定义无限滚动指令的生命周期钩子。
const infiniteScroll = {
  /**
   * 当指令第一次绑定到元素并且父组件挂载完毕时调用。
   * @param {HTMLElement} el - 绑定的元素。
   * @param {object} binding - 绑定对象。
   */
  mounted(el, binding) {
    // 查找并确定滚动容器。
    const scrollContainer = getScrollContainer(el);
    // 创建一个滚动事件处理函数，该函数会调用核心的 handleScroll 逻辑。
    const onScroll = () => handleScroll(el, binding);

    // 在绑定元素上创建一个私有作用域对象，用于存储状态和引用。
    el[SCOPE] = {
      scrollContainer, // 存储滚动容器的引用。
      onScroll, // 存储滚动处理函数的引用，以便后续移除。
      loading: false, // 初始化加载状态锁。
    };

    // 为滚动容器添加滚动事件监听器。
    scrollContainer.addEventListener('scroll', onScroll);
  },

  /**
   * 当绑定的元素从 DOM 中移除时调用。
   * @param {HTMLElement} el - 绑定的元素。
   */
  unmounted(el) {
    // 从元素的私有作用域中获取之前存储的引用。
    const { scrollContainer, onScroll } = el[SCOPE];
    // 如果引用存在，则移除事件监听器，防止内存泄漏。
    if (scrollContainer && onScroll) {
      scrollContainer.removeEventListener('scroll', onScroll);
    }
    // 清理掉附加在元素上的私有作用域对象。
    delete el[SCOPE];
  },
};

// 导出符合 Vue 插件规范的对象。
export default {
  /**
   * Vue 插件的 install 方法。
   * @param {object} app - Vue 应用实例。
   */
  install(app) {
    // 将 infiniteScroll 注册为全局自定义指令 'infinite-scroll'。
    app.directive('infinite-scroll', infiniteScroll);
  },
};
