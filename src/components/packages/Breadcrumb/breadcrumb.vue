<template>
  <div class="pilot-breadcrumb" role="navigation" aria-label="breadcrumb">
    <PilotBreadcrumbItem
      v-for="(item, index) in breadcrumbs"
      :key="item.path"
      :to="index < breadcrumbs.length - 1 ? item.path : ''"
    >
      {{ item.meta.title }}
    </PilotBreadcrumbItem>
  </div>
</template>

<script>
import PilotBreadcrumbItem from '../BreadcrumbItem/breadcrumb-item.vue';

export default {
  name: 'PilotBreadcrumb',
  components: {
    PilotBreadcrumbItem,
  },
  props: {
    separator: {
      type: String,
      default: '/',
    },
    separatorClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      breadcrumbs: [],
    };
  },
  provide() {
    // 将 props 注入给子组件
    return {
      breadcrumbContext: this,
    };
  },
  watch: {
    // 监听路由变化，更新面包屑
    '$route.path'() {
      this.getBreadcrumbs();
    },
  },
  created() {
    // 组件创建时，获取初始面包屑
    this.getBreadcrumbs();
  },
  methods: {
    getBreadcrumbs() {
      // 从路由记录中过滤出需要显示在面包屑的项
      this.breadcrumbs = this.$route.matched.filter((item) => item.meta && item.meta.title);
    },
  },
};
</script>

<style lang="scss">
.pilot-breadcrumb {
  display: flex;
  font-size: 14px;
  line-height: 1;
}

.pilot-breadcrumb__item {
  display: flex;
  align-items: center;

  .pilot-breadcrumb__inner {
    color: #606266;
  }

  .pilot-breadcrumb__inner.is-link,
  .pilot-breadcrumb__inner a {
    font-weight: 700;
    text-decoration: none;
    transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    color: #303133;
  }

  .pilot-breadcrumb__inner.is-link:hover,
  .pilot-breadcrumb__inner a:hover {
    color: #409eff;
    cursor: pointer;
  }

  /* We use CSS to hide the separator of the last item */
  &:last-child .pilot-breadcrumb__separator {
    display: none;
  }
}

.pilot-breadcrumb__separator {
  margin: 0 9px;
  font-weight: 700;
  color: #c0c4cc;

  &[class*='icon'] {
    margin: 0 6px;
    font-weight: normal;
  }
}
</style>
