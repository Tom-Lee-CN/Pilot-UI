<template>
  <div class="pt-cascader-panel" :class="{ 'is-multiple': multiple }">
    <!-- 遍历每一级的菜单 -->
    <div v-for="(menu, level) in menus" :key="level" class="pt-cascader-menu">
      <div class="pt-cascader-menu__wrap">
        <!-- 遍历菜单中的每个选项 -->
        <div
          v-for="item in menu"
          :key="item[config.value]"
          :class="[
            'pt-cascader-menu__item',
            { 'is-active': isActive(item, level), 'is-disabled': item.disabled },
          ]"
          @click="handleItemClick(item, level)"
        >
          <!-- 多选框 -->
          <label v-if="multiple" class="pt-cascader-checkbox" @click.stop>
            <input
              type="checkbox"
              :checked="getNodeState(item).isChecked"
              :indeterminate="getNodeState(item).isIndeterminate"
              :disabled="item.disabled"
              @change="handleCheckboxChange(item, $event)"
            />
            <span class="pt-cascader-checkbox__inner"></span>
          </label>

          <span>{{ item[config.label] }}</span>
          <!-- 如果不是叶子节点，显示右箭头或加载图标 -->
          <span v-if="!isLeaf(item)" class="pt-cascader-menu__item-arrow">
            <pt-icon v-if="item.loading" name="loading" class="is-loading"></pt-icon>
            <pt-icon v-else name="arrow-right"></pt-icon>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PilotCascaderPanel',
  props: {
    // 绑定值 (v-model)
    modelValue: {
      type: Array,
      default: () => [],
    },
    // 数据源
    options: {
      type: Array,
      default: () => [],
    },
    // 配置选项
    props: {
      type: Object,
      default: () => ({}),
    },
    // 是否懒加载
    lazy: {
      type: Boolean,
      default: false,
    },
    // 懒加载函数
    lazyLoad: {
      type: Function,
      default: null,
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  // 声明组件会触发的自定义事件
  emits: ['change'],
  data() {
    return {
      menus: [], // 存储各级菜单的数据
      activePath: [], // 单选模式下激活的路径
      checkedPaths: [], // 多选模式下选中的路径集合
    };
  },
  computed: {
    // 合并默认配置和用户传入的 props
    config() {
      return {
        value: 'value',
        label: 'label',
        children: 'children',
        leaf: 'leaf',
        ...this.props,
      };
    },
    // 将树形结构数据扁平化，方便查找
    flattedNodes() {
      const result = [];
      const stack = [];
      const rootNodes = this.menus[0] || [];

      rootNodes.forEach((node) => {
        stack.push({ node, path: [node], pathValues: [node[this.config.value]] });
      });

      while (stack.length) {
        const { node, path, pathValues } = stack.pop();
        result.push({ ...node, path, pathValues });

        const children = node[this.config.children];
        if (children) {
          children.forEach((child) => {
            stack.push({
              node: child,
              path: path.concat(child),
              pathValues: pathValues.concat(child[this.config.value]),
            });
          });
        }
      }
      return result;
    },
  },
  watch: {
    // 监听 options 变化，初始化第一级菜单
    options: {
      handler() {
        if (!this.lazy) {
          this.menus = [this.options];
        }
      },
      immediate: true,
    },
    // 监听 v-model 的变化，更新内部状态
    modelValue: {
      handler(newVal) {
        // 增加安全校验，防止意外的非数组值破坏组件状态
        if (!Array.isArray(newVal)) {
          return;
        }
        if (this.multiple) {
          this.checkedPaths = newVal.map((path) => [...path]);
        } else {
          this.activePath = [...newVal];
          this.updateMenus();
        }
      },
      immediate: true,
    },
  },
  mounted() {
    // 如果是懒加载且初始菜单为空，则加载根节点
    if (this.lazy && (!this.menus[0] || this.menus[0].length === 0)) {
      this.lazyLoad({ level: 0 }, (nodes) => {
        this.menus = [nodes];
      });
    }
  },
  methods: {
    // 判断是否为叶子节点
    isLeaf(item) {
      if (this.lazy) {
        return item[this.config.leaf] === true;
      }
      return !item[this.config.children] || item[this.config.children].length === 0;
    },

    // 判断节点是否处于激活状态（单选）
    isActive(item, level) {
      return this.activePath[level] === item[this.config.value];
    },

    // 根据 activePath 更新显示的菜单
    updateMenus() {
      if (this.lazy || !this.options || this.options.length === 0) return;
      const newMenus = [this.options];
      let currentOptions = this.options;
      for (const value of this.activePath) {
        const selectedItem = currentOptions?.find((option) => option[this.config.value] === value);
        if (selectedItem && selectedItem[this.config.children]) {
          newMenus.push(selectedItem[this.config.children]);
          currentOptions = selectedItem[this.config.children];
        } else {
          break;
        }
      }
      this.menus = newMenus;
    },

    // 处理选项点击事件
    handleItemClick(item, level) {
      if (item.disabled || item.loading) return;

      // 更新激活路径和菜单
      this.activePath.splice(level, this.activePath.length - level, item[this.config.value]);
      this.menus.splice(level + 1);

      if (this.isLeaf(item)) {
        // 如果是叶子节点且是单选模式，则发出 change 事件
        if (!this.multiple) {
          const valuePath = [...this.activePath];
          const labelPath = this.getLabelPath(valuePath);
          this.$emit('change', valuePath, labelPath);
        }
      } else {
        // 如果不是叶子节点，加载子节点
        this.loadNodeIfNeeded(item, level);
      }
    },

    // 按需加载子节点（懒加载）
    loadNodeIfNeeded(item, level) {
      if (this.lazy && !item[this.config.children]) {
        item.loading = true;
        const node = { ...item, level: level };
        this.lazyLoad(node, (nodes) => {
          item.loading = false;
          const childNodes = Array.isArray(nodes) ? nodes : [];
          item[this.config.children] = childNodes;
          if (childNodes.length > 0) {
            this.menus.push(childNodes);
          }
        });
      } else if (item[this.config.children]) {
        this.menus.push(item[this.config.children]);
      }
    },

    // 根据 value 路径获取 label 路径
    getLabelPath(valuePath) {
      const flatNode = this.flattedNodes.find((node) =>
        this.isSamePath(node.pathValues, valuePath),
      );
      return flatNode ? flatNode.path.map((p) => p[this.config.label]) : [];
    },

    // 获取节点的选中状态（选中/半选）
    getNodeState(node) {
      const nodeInfo = this.flattedNodes.find(
        (n) => n[this.config.value] === node[this.config.value],
      );
      if (!nodeInfo) return { isChecked: false, isIndeterminate: false };

      if (this.isLeaf(node)) {
        const isChecked = this.checkedPaths.some((p) => this.isSamePath(p, nodeInfo.pathValues));
        return { isChecked, isIndeterminate: false };
      }

      const descendantLeaves = this.getDescendantLeaves(node);
      if (descendantLeaves.length === 0) {
        return { isChecked: false, isIndeterminate: false };
      }

      const descendantLeafPaths = descendantLeaves
        .map((leaf) => {
          const leafInfo = this.flattedNodes.find(
            (n) => n[this.config.value] === leaf[this.config.value],
          );
          return leafInfo ? leafInfo.pathValues : null;
        })
        .filter(Boolean);

      if (descendantLeafPaths.length === 0) {
        return { isChecked: false, isIndeterminate: false };
      }

      const checkedCount = descendantLeafPaths.filter((leafPath) =>
        this.checkedPaths.some((p) => this.isSamePath(p, leafPath)),
      ).length;

      const allChecked = checkedCount > 0 && checkedCount === descendantLeafPaths.length;
      const isIndeterminate = checkedCount > 0 && !allChecked;

      return { isChecked: allChecked, isIndeterminate };
    },

    // 获取一个节点的所有后代叶子节点
    getDescendantLeaves(node) {
      const leaves = [];
      const stack = [node];
      while (stack.length) {
        const current = stack.pop();
        if (this.isLeaf(current)) {
          if (!current.disabled) leaves.push(current);
        } else if (current[this.config.children]) {
          stack.push(...current[this.config.children]);
        }
      }
      return leaves;
    },

    // 处理复选框状态变化事件
    handleCheckboxChange(item, event) {
      const shouldBeChecked = event.target.checked;
      const descendantLeaves = this.getDescendantLeaves(item);
      const pathsToToggle = (this.isLeaf(item) ? [item] : descendantLeaves)
        .map((leaf) => {
          const leafInfo = this.flattedNodes.find(
            (n) => n[this.config.value] === leaf[this.config.value],
          );
          return leafInfo ? leafInfo.pathValues : null;
        })
        .filter(Boolean);

      let newCheckedPaths = [...this.checkedPaths];
      if (shouldBeChecked) {
        pathsToToggle.forEach((path) => {
          if (!newCheckedPaths.some((p) => this.isSamePath(p, path))) {
            newCheckedPaths.push(path);
          }
        });
      } else {
        newCheckedPaths = newCheckedPaths.filter(
          (p) => !pathsToToggle.some((togglePath) => this.isSamePath(p, togglePath)),
        );
      }

      const finalPaths = newCheckedPaths;
      const labelPaths = finalPaths.map((path) => this.getLabelPath(path));
      this.$emit('change', finalPaths, labelPaths);
    },

    // 判断两个路径是否相同
    isSamePath(pathA, pathB) {
      if (!pathA || !pathB || pathA.length !== pathB.length) return false;
      return pathA.every((val, i) => val === pathB[i]);
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../../styles/variables.scss';

// 面板根元素
.pt-cascader-panel {
  display: flex;
  border-radius: 4px;
  font-size: 14px;
}

// 单级菜单
.pt-cascader-menu {
  min-width: 180px;
  box-sizing: border-box;
  border-right: 1px solid #e4e7ed;

  &:last-child {
    border-right: none;
  }
}

// 菜单滚动包裹层
.pt-cascader-menu__wrap {
  height: 204px;
  padding: 6px 0;
  overflow-y: auto;
}

// 菜单项
.pt-cascader-menu__item {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f7fa;
  }

  // 激活状态（单选）
  &.is-active {
    color: $primary-color;
    font-weight: bold;
  }

  // 禁用状态
  &.is-disabled {
    color: #c0c4cc;
    cursor: not-allowed;
    background-color: transparent;
  }
}

// 菜单项右侧箭头
.pt-cascader-menu__item-arrow {
  margin-left: auto;
  .is-loading {
    animation: rotate 2s linear infinite;
  }
}

// 复选框样式
.pt-cascader-checkbox {
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  cursor: pointer;

  input {
    display: none;
  }

  &__inner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    box-sizing: border-box;
    position: relative;
    transition: all 0.2s;

    // 对勾
    &::after {
      content: '';
      position: absolute;
      left: 4px;
      top: 1px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      opacity: 0;
      transition: opacity 0.2s;
    }
  }

  // 选中状态
  input:checked + &__inner {
    background-color: $primary-color;
    border-color: $primary-color;
    &::after {
      opacity: 1;
    }
  }

  // 半选状态
  input:indeterminate + &__inner {
    background-color: $primary-color;
    border-color: $primary-color;
    // 半选时显示横线
    &::after {
      content: '';
      position: absolute;
      left: 2px;
      top: 5px;
      width: 8px;
      height: 2px;
      background-color: white;
      transform: none;
      opacity: 1;
    }
  }

  // 禁用状态
  input:disabled + &__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    cursor: not-allowed;
  }
}

// 多选模式下，取消 is-active 的特殊样式
.is-multiple .pt-cascader-menu__item.is-active {
  color: inherit;
  font-weight: normal;
}

// 加载中旋转动画
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
