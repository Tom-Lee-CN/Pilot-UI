const SCOPE = 'PilotInfiniteScroll';

const getScrollContainer = (el) => {
  let parent = el;
  while (parent) {
    // 优先检查是否在 pilot-scrollbar 组件内部
    if (parent.classList.contains('pilot-scrollbar__wrap')) {
      return parent;
    }
    if (parent === document.documentElement || parent === document.body) {
      return window;
    }
    // 回退到检查 overflow 样式
    const { overflowY } = window.getComputedStyle(parent);
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return parent;
    }
    parent = parent.parentNode;
  }
  return window;
};

const handleScroll = (el, binding) => {
  const { handler, disabled, delay = 200, distance = 0 } = binding.value;

  const scrollContainer = el[SCOPE].scrollContainer;
  const scrollEl = scrollContainer === window ? document.documentElement : scrollContainer;

  if (disabled || el[SCOPE].loading) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollEl;

  if (scrollHeight - scrollTop <= clientHeight + distance) {
    el[SCOPE].loading = true;
    setTimeout(() => {
      handler();
      // 检查组件是否已卸载
      if (el[SCOPE]) {
        el[SCOPE].loading = false;
      }
    }, delay);
  }
};

const infiniteScroll = {
  mounted(el, binding) {
    const scrollContainer = getScrollContainer(el);
    const onScroll = () => handleScroll(el, binding);

    el[SCOPE] = {
      scrollContainer,
      onScroll,
      loading: false,
    };

    scrollContainer.addEventListener('scroll', onScroll);
  },
  unmounted(el) {
    const { scrollContainer, onScroll } = el[SCOPE];
    if (scrollContainer && onScroll) {
      scrollContainer.removeEventListener('scroll', onScroll);
    }
    // 清理 el 上的属性
    delete el[SCOPE];
  },
};

export default {
  install(app) {
    app.directive('infinite-scroll', infiniteScroll);
  },
};
