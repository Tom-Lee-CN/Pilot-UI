import { createApp } from 'vue';
import LoadingComponent from './loading.vue';

const loadingDirective = {
  mounted(el, binding) {
    const app = createApp(LoadingComponent);
    const instance = app.mount(document.createElement('div'));
    el.instance = instance;

    if (binding.value) {
      append(el);
    }

    const text = el.getAttribute('pilot-loading-text');
    if (text) {
      el.instance.text = text;
    }
  },
  updated(el, binding) {
    const text = el.getAttribute('pilot-loading-text');
    if (text) {
      el.instance.text = text;
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el);
    }
  },
  unmounted(el) {
    // 在 Vue 3 中，销毁 app 实例即可
    // el.instance.$destroy?.(); // 这是 Vue 2 的方法
    // 我们没有直接的方法来卸载一个 app 实例，但可以确保 DOM 被清理
    remove(el);
    el.instance = null;
  },
};

function append(el) {
  // 确保目标元素是相对定位或绝对定位，以便遮罩层能正确定位
  const style = getComputedStyle(el);
  if (['absolute', 'relative', 'fixed'].indexOf(style.position) === -1) {
    el.style.position = 'relative';
  }
  el.appendChild(el.instance.$el);
}

function remove(el) {
  if (el.instance && el.instance.$el && el.instance.$el.parentNode) {
    el.instance.$el.parentNode.removeChild(el.instance.$el);
  }
}

export default loadingDirective;
