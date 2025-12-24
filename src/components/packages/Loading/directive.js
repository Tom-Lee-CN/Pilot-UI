// 导入 Vue 的 createApp 方法，用于创建应用实例
import { createApp } from 'vue';
// 导入 Loading 组件
import LoadingComponent from './loading.vue';

/**
 * 从指令的绑定值中提取加载状态
 * @param {object} binding - 指令的绑定对象
 * @returns {boolean}
 */
function getLoadingState(binding) {
  if (typeof binding.value === 'object' && binding.value !== null) {
    return !!binding.value.value;
  }
  return !!binding.value;
}

/**
 * 更新 loading 组件的选项，例如文字
 * @param {HTMLElement} el - 指令所绑定的元素
 * @param {object} binding - 指令的绑定对象
 */
function updateOptions(el, binding) {
  let text = null;
  // 优先从 v-loading 的绑定对象中获取 text
  if (typeof binding.value === 'object' && binding.value !== null) {
    text = binding.value.text;
  }

  // 如果绑定对象中没有，则回退到 pilot-loading-text 属性
  if (!text) {
    text = el.getAttribute('pilot-loading-text');
  }

  // 如果获取到文本，则更新到组件实例上
  if (el.instance) {
    el.instance.text = text;
  }
}

// 定义 loading 指令
const loadingDirective = {
  /**
   * 当被绑定的元素挂载到 DOM 中时调用
   * @param {HTMLElement} el - 指令所绑定的元素
   * @param {object} binding - 一个对象，包含指令的很多信息
   */
  mounted(el, binding) {
    // 创建 LoadingComponent 的 Vue 应用实例
    const app = createApp(LoadingComponent);
    // 创建一个 div 元素，并将应用实例挂载到这个 div 上
    const instance = app.mount(document.createElement('div'));
    // 将 loading 组件的实例存储在 el 上，方便后续访问
    el.instance = instance;

    // 设置初始的加载文案
    updateOptions(el, binding);

    // 如果指令的初始值为 true，则显示 loading
    if (getLoadingState(binding)) {
      append(el);
    }
  },

  /**
   * 在包含组件的 VNode 及其子组件的 VNode 更新后调用
   * @param {HTMLElement} el - 指令所绑定的元素
   * @param {object} binding - 一个对象，包含指令的很多信息
   */
  updated(el, binding) {
    // 每次更新时，都尝试更新加载文案
    updateOptions(el, binding);

    const oldState = getLoadingState(binding.oldValue);
    const newState = getLoadingState(binding);

    // 如果指令的值发生变化
    if (newState !== oldState) {
      // 根据值的真假，决定是显示还是移除 loading
      newState ? append(el) : remove(el);
    }
  },

  /**
   * 当指令与元素解绑时调用
   * @param {HTMLElement} el - 指令所绑定的元素
   */
  unmounted(el) {
    // 在 Vue 3 中，我们没有直接的方法来卸载一个 app 实例，
    // 但我们可以确保 DOM 被清理干净
    remove(el);
    // 清理存储在 el 上的实例引用
    el.instance = null;
  },
};

/**
 * 将 loading 元素添加到目标元素中
 * @param {HTMLElement} el - 目标元素
 */
function append(el) {
  // 获取目标元素的计算样式
  const style = getComputedStyle(el);
  // 确保目标元素是相对定位、绝对定位或固定定位，以便遮罩层能正确定位
  if (['absolute', 'relative', 'fixed'].indexOf(style.position) === -1) {
    el.style.position = 'relative';
  }
  // 将 loading 组件的 DOM 元素添加到目标元素中
  el.appendChild(el.instance.$el);
}

/**
 * 从目标元素中移除 loading 元素
 * @param {HTMLElement} el - 目标元素
 */
function remove(el) {
  // 确保 loading 实例及其 DOM 元素存在，并且有父节点
  if (el.instance && el.instance.$el && el.instance.$el.parentNode) {
    // 从其父节点中移除 loading 元素
    el.instance.$el.parentNode.removeChild(el.instance.$el);
  }
}

// 导出 loading 指令
export default loadingDirective;
