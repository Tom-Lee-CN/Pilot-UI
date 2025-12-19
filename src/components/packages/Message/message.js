import { createVNode, render } from 'vue';
import MessageConstructor from './message.vue';

// 存储所有 Message 实例的数组
const instances = [];
// 实例之间的垂直间距
const GAP_SIZE = 5;
// 用于生成唯一 ID 的种子数
let seed = 1;

/**
 * @description 创建并显示一个全局 Message 提示
 * @param {object | string} options - 配置对象或要显示的字符串消息
 */
const Message = (options) => {
  // 如果传入的是字符串，则转换为标准 options 对象
  if (typeof options === 'string') {
    options = {
      message: options,
    };
  }

  // 计算当前实例的初始顶部偏移量
  let topOffset = options.offset || 20;
  // 遍历现有实例，累加它们的高度和间距，以确定新实例的位置
  instances.forEach((instance) => {
    const el = instance.el;
    if (el) {
      topOffset += el.offsetHeight + GAP_SIZE;
    }
  });

  // 为新实例创建一个唯一的 ID
  const id = `message_${seed++}`;
  // 保存用户自定义的 onClose 回调
  const userOnClose = options.onClose;

  // 创建一个 div 容器，用于挂载 Message 组件
  const container = document.createElement('div');
  document.body.appendChild(container);

  // 准备传递给 Message 组件的 props
  const props = {
    ...options,
    id,
    offset: topOffset,
    // 封装 onClose 回调，以便在组件关闭时执行内部处理逻辑
    onClose: () => {
      handleClose(id, userOnClose);
    },
  };

  // 创建 Message 组件的虚拟节点 (VNode)
  const vm = createVNode(MessageConstructor, props);

  // 定义 onDestroy 回调，在组件动画销毁后被调用
  vm.props.onDestroy = () => {
    // 找到要销毁的实例索引
    const idx = instances.findIndex((instance) => instance.id === id);
    if (idx > -1) {
      const instance = instances[idx];
      // 卸载组件并从 DOM 中移除容器
      render(null, instance.container);
      document.body.removeChild(instance.container);
      // 从实例数组中移除
      instances.splice(idx, 1);
    }
  };

  // 将 VNode 渲染到容器中
  render(vm, container);

  // 创建实例对象并存入 instances 数组
  const instance = {
    id,
    component: vm.component,
    container,
    // 使用 getter 确保能稳定获取到组件的根 DOM 元素
    get el() {
      return vm.component?.subTree?.el;
    },
  };

  instances.push(instance);

  // 挂载后，将组件的 visible 状态设为 true，触发进入动画
  vm.component.proxy.visible = true;

  // 返回一个包含 close 方法的对象，允许外部手动关闭
  return {
    close: () => vm.component.proxy.close(),
  };
};

// 添加 .success, .error 等便捷方法
['success', 'warning', 'error', 'info'].forEach((type) => {
  Message[type] = (options) => {
    if (typeof options === 'string') {
      options = { message: options };
    }
    return Message({ ...options, type });
  };
});
/**
 * @description 处理 Message 关闭后的逻辑，主要是重新计算下方 Message 的位置
 * @param {string} id - 要关闭的 Message 的 ID
 * @param {function} userOnClose - 用户自定义的 onClose 回调
 */
function handleClose(id, userOnClose) {
  // 找到要关闭的实例在数组中的索引
  const idx = instances.findIndex((instance) => instance.id === id);
  if (idx === -1) return;

  const instance = instances[idx];
  // 如果用户提供了 onClose 回调，则执行它
  if (userOnClose) {
    userOnClose(instance);
  }

  const el = instance.el;
  if (!el) return;

  // 获取被关闭实例的高度
  const removedHeight = el.offsetHeight;

  // 遍历该实例下方的所有实例
  for (let i = idx + 1; i < instances.length; i++) {
    const inst = instances[i];
    // 将它们的偏移量向上移动，填补空缺
    inst.component.proxy.offsetValue -= removedHeight + GAP_SIZE;
  }
}

export default Message;
