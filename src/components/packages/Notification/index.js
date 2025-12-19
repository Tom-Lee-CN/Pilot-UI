import { createVNode, render, nextTick } from 'vue';
import NotificationComponent from './notification.vue';

const instances = []; // 存储当前可见的通知实例
const notificationQueue = []; // 存储等待显示的通知队列
const MAX_NOTIFICATIONS = 5; // 屏幕上最多同时显示的通知数量
let seed = 1;
const GAP_SIZE = 16;

const recalculatePositions = () => {
  nextTick(() => {
    const positions = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];
    positions.forEach((position) => {
      const samePositionInstances = instances.filter(({ vm }) => vm.props.position === position);
      samePositionInstances.reverse();
      let currentOffset = GAP_SIZE;
      samePositionInstances.forEach(({ vnode, vm }) => {
        vm.proxy.currentOffset = currentOffset;
        currentOffset += (vnode.el?.offsetHeight || 0) + GAP_SIZE;
      });
    });
  });
};

// 内部函数，实际创建并显示一个通知
const show = (options) => {
  const id = `notification_${seed++}`;
  const container = document.createElement('div');

  const userOnClose = options.onClose;
  const props = {
    ...options,
    offset: options.offset || 0,
    id,
    onClose: () => {
      userOnClose?.();
      close(id); // 关闭时触发核心的 close 逻辑
    },
    onDestroy: () => {
      render(null, container);
    },
  };

  const vnode = createVNode(NotificationComponent, props);
  render(vnode, container);
  document.body.appendChild(container.firstElementChild);
  const vm = vnode.component;
  instances.push({ vnode, vm });
  recalculatePositions();

  return {
    close: () => {
      vm.proxy.close();
    },
  };
};

// 内部函数，处理关闭逻辑
const close = (id) => {
  const index = instances.findIndex(({ vm }) => vm.props.id === id);
  if (index === -1) return;

  instances.splice(index, 1);
  recalculatePositions();

  // 核心改动：一个通知关闭后，检查队列里是否有等待的通知
  if (notificationQueue.length > 0) {
    const nextOptions = notificationQueue.shift(); // 取出队列的第一个
    show(nextOptions); // 显示它
  }
};

/**
 * 关闭所有通知 (命名导出)
 */
export const closeAll = () => {
  // 同时清空等待队列
  notificationQueue.length = 0;
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].vm.proxy.close();
  }
};

/**
 * 创建并显示一个通知 (默认导出)
 * @param {object} options - 通知配置项
 */
const Notification = (options = {}) => {
  // 如果当前显示的通知数量达到了上限
  if (instances.length >= MAX_NOTIFICATIONS) {
    notificationQueue.push(options); // 将新通知的配置推入队列
    // 返回一个句柄，允许从队列中移除这个未显示的通知
    return {
      close: () => {
        const index = notificationQueue.indexOf(options);
        if (index > -1) {
          notificationQueue.splice(index, 1);
        }
      },
    };
  }
  // 如果未达到上限，则直接显示
  return show(options);
};

export default Notification;
