<template>
  <div>
    <h1>Select 选择器</h1>
    <p>当选项过多时，使用下拉菜单展示并选择内容。</p>

    <!-- 基础用法 -->
    <h2>基础用法</h2>
    <p>适用广泛的基础选择器。</p>
    <div class="demo-block">
      <pt-select v-model="value1" placeholder="请选择">
        <pt-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></pt-option>
      </pt-select>
      <p>当前选中值：{{ value1 }}</p>
    </div>

    <!-- 禁用状态 -->
    <h2>禁用状态</h2>
    <p>为 `pt-select` 设置 `disabled` 属性，禁用整个选择器。</p>
    <div class="demo-block">
      <pt-select v-model="value1" placeholder="请选择" disabled>
        <pt-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></pt-option>
      </pt-select>
    </div>
    <p>你也可以单独禁用某个选项。</p>
    <div class="demo-block">
      <pt-select v-model="value2" placeholder="请选择">
        <pt-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        ></pt-option>
      </pt-select>
      <p>当前选中值：{{ value2 }}</p>
    </div>

    <!-- 可清空 -->
    <h2>可清空</h2>
    <p>为 `pt-select` 设置 `clearable` 属性，则可将选择器清空。</p>
    <div class="demo-block">
      <pt-select v-model="value1" placeholder="请选择" clearable>
        <pt-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></pt-option>
      </pt-select>
    </div>

    <!-- 多选 -->
    <h2>多选</h2>
    <p>为 `pt-select` 设置 `multiple` 属性，即可启用多选模式。</p>
    <div class="demo-block">
      <pt-select v-model="valueMultiple" placeholder="请选择" multiple>
        <pt-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></pt-option>
      </pt-select>
      <p>当前选中值：{{ valueMultiple.join(', ') }}</p>
    </div>

    <!-- 可搜索 -->
    <h2>可搜索</h2>
    <p>为 `pt-select` 设置 `filterable` 属性，即可启用搜索功能。</p>
    <div class="demo-block">
      <pt-select v-model="value1" placeholder="请选择或搜索" filterable>
        <pt-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></pt-option>
      </pt-select>
    </div>

    <!-- 创建新条目 -->
    <h2>创建新条目</h2>
    <p>
      为 `pt-select` 设置 `allow-create` 和 `filterable`
      属性，用户可以创建并选中列表中不存在的条目。
    </p>
    <div class="demo-block">
      <pt-select v-model="valueCreate" placeholder="请选择或创建" filterable allow-create multiple>
        <pt-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></pt-option>
      </pt-select>
      <p>当前选中值：{{ valueCreate.join(', ') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectDoc',
  data() {
    return {
      options: [
        { value: 'Option1', label: '黄金糕' },
        { value: 'Option2', label: '双皮奶' },
        { value: 'Option3', label: '蚵仔煎', disabled: true },
        { value: 'Option4', label: '龙须面' },
        { value: 'Option5', label: '北京烤鸭' },
      ],
      value1: '',
      value2: '',
      valueMultiple: [],
      valueCreate: [],
    };
  },
};
</script>

<style scoped>
.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  padding: 24px;
  margin-bottom: 20px;
}
h1,
h2,
p {
  margin-bottom: 1em;
}
</style>
