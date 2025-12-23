<template>
  <div class="demo-container">
    <h2>Cascader 级联选择器</h2>
    <p>用于处理多层级结构的数据选择。</p>

    <h3>基础用法</h3>
    <div class="demo-section">
      <p>v-model 绑定的是一个包含各级 value 的数组。</p>
      <pt-cascader
        v-model="selectedValue1"
        :options="options1"
        placeholder="请选择"
        @change="handleChange"
      ></pt-cascader>
      <p>当前选中值: {{ selectedValue1 }}</p>
    </div>

    <h3>自定义 Props</h3>
    <div class="demo-section">
      <p>通过 `props` 属性可以自定义数据源中的字段名。</p>
      <pt-cascader
        v-model="selectedValue2"
        :options="options2"
        :props="customProps"
        placeholder="请选择城市"
      ></pt-cascader>
      <p>当前选中值: {{ selectedValue2 }}</p>
    </div>

    <h3>禁用选项</h3>
    <div class="demo-section">
      <p>可以禁用任意层级的选项。</p>
      <pt-cascader v-model="selectedValue3" :options="options3" placeholder="请选择"></pt-cascader>
      <p>当前选中值: {{ selectedValue3 }}</p>
    </div>

    <h3>组件禁用状态</h3>
    <div class="demo-section">
      <p>通过 `disabled` 属性可以禁用整个组件。</p>
      <pt-cascader v-model="selectedValue1" :options="options1" :disabled="true"></pt-cascader>
    </div>

    <h3>可清空</h3>
    <div class="demo-section">
      <p>通过 `clearable` 属性可以一键清空已选值。</p>
      <pt-cascader
        v-model="selectedValue1"
        :options="options1"
        placeholder="请选择"
        :clearable="true"
      ></pt-cascader>
    </div>

    <h3>动态加载</h3>
    <div class="demo-section">
      <p>通过 `lazy` 和 `lazyLoad` 属性可以实现动态加载子节点。</p>
      <pt-cascader
        v-model="selectedValue4"
        :lazy="true"
        :lazy-load="lazyLoad"
        placeholder="动态加载"
      ></pt-cascader>
      <p>当前选中值: {{ selectedValue4 }}</p>
    </div>

    <h3>多选功能</h3>
    <div class="demo-section">
      <p>通过 `multiple` 属性开启多选。</p>
      <pt-cascader
        v-model="selectedValue5"
        :options="options1"
        :multiple="true"
        placeholder="请选择 (可多选)"
        :clearable="true"
      ></pt-cascader>
      <p>当前选中值: {{ selectedValue5 }}</p>
    </div>
  </div>
</template>

<script>
let id = 0;

export default {
  name: 'CascaderDemo',
  data() {
    return {
      selectedValue1: [],
      selectedValue2: [],
      selectedValue3: [],
      selectedValue4: [],
      selectedValue5: [],
      options1: [
        {
          value: 'guide',
          label: '指南',
          children: [
            {
              value: 'design',
              label: '设计原则',
              children: [
                { value: 'consistency', label: '一致' },
                { value: 'feedback', label: '反馈' },
                { value: 'efficiency', label: '效率' },
                { value: 'controllability', label: '可控' },
              ],
            },
            {
              value: 'navigation',
              label: '导航',
              children: [
                { value: 'side-nav', label: '侧向导航' },
                { value: 'top-nav', label: '顶部导航' },
              ],
            },
          ],
        },
        {
          value: 'component',
          label: '组件',
          children: [
            { value: 'basic', label: '基础' },
            { value: 'form', label: '表单' },
            { value: 'data', label: '数据' },
          ],
        },
      ],
      options2: [
        {
          id: 'zhejiang',
          name: '浙江',
          items: [
            {
              id: 'hangzhou',
              name: '杭州',
              items: [
                { id: 'xihu', name: '西湖' },
                { id: 'binjiang', name: '滨江' },
              ],
            },
          ],
        },
        {
          id: 'jiangsu',
          name: '江苏',
          items: [
            { id: 'nanjing', name: '南京' },
            { id: 'suzhou', name: '苏州' },
          ],
        },
      ],
      options3: [
        {
          value: 'guide',
          label: '指南',
          children: [
            { value: 'design', label: '设计原则', disabled: true },
            { value: 'navigation', label: '导航' },
          ],
        },
        {
          value: 'component',
          label: '组件',
          disabled: true,
        },
      ],
      customProps: {
        value: 'id',
        label: 'name',
        children: 'items',
      },
    };
  },
  methods: {
    handleChange(value) {
      console.log('Selected Path:', value);
    },
    lazyLoad(node, resolve) {
      const { level } = node;
      setTimeout(() => {
        const nodes = Array.from({ length: level + 1 }).map(() => ({
          value: ++id,
          label: `选项 ${id}`,
          leaf: level >= 2,
        }));
        // 通过 resolve 回调, 返回子节点
        resolve(nodes);
      }, 1000);
    },
  },
};
</script>

<style scoped>
.demo-container {
  padding: 20px;
}
.demo-section {
  margin-bottom: 30px;
}
h2,
h3,
p {
  margin-bottom: 10px;
}
</style>
