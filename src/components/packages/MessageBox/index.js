import { createApp } from 'vue';
import MessageBoxComponent from './message-box.vue';

const MessageBox = (options) => {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const cleanup = () => {
      app.unmount();
      document.body.removeChild(container);
    };

    const app = createApp(MessageBoxComponent, {
      ...options,
      onAction: (action) => {
        if (action === 'confirm') {
          resolve(action);
        } else {
          reject(action);
        }
        cleanup();
      },
    });

    app.mount(container);
  });
};

export default MessageBox;
