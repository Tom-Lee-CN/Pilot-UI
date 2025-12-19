<template>
  <component :is="tag" :class="colKls" :style="style">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'PilotCol',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    span: {
      type: Number,
      default: 24,
    },
    offset: {
      type: Number,
      default: 0,
    },
    // 响应式属性，接收数字作为 span 值. 超小屏幕, 通常指 <768px 的手机屏幕
    xs: Number,
    // 小屏幕, 通常指 ≥768px 的平板电脑
    sm: Number,
    // 中等屏幕, 通常指 ≥992px 的小尺寸桌面显示器
    md: Number,
    // 大屏幕, 通常指 ≥1200px 的标准桌面显示器
    lg: Number,
    // 超大屏幕, 通常指 ≥1920px 的大尺寸桌面显示器
    xl: Number,
  },
  inject: {
    gutter: {
      default: 0,
    },
  },
  computed: {
    style() {
      const ret = {};
      if (this.gutter) {
        ret.paddingLeft = `${this.gutter / 2}px`;
        ret.paddingRight = ret.paddingLeft;
      }
      return ret;
    },
    colKls() {
      const kls = ['pilot-col'];
      if (this.span) {
        kls.push(`pilot-col-${this.span}`);
      }
      if (this.offset) {
        kls.push(`pilot-col-offset-${this.offset}`);
      }
      // 响应式的 span
      ['xs', 'sm', 'md', 'lg', 'xl'].forEach((size) => {
        if (typeof this[size] === 'number') {
          kls.push(`pilot-col-${size}-${this[size]}`);
        }
      });
      return kls;
    },
  },
};
</script>

<style lang="scss">
@use 'sass:math';
.pilot-col {
  box-sizing: border-box;
}

@for $i from 0 through 24 {
  .pilot-col-#{$i} {
    width: (math.div($i, 24)) * 100%;
  }
  .pilot-col-offset-#{$i} {
    margin-left: (math.div($i, 24)) * 100%;
  }
}

// --- 响应式断点 ---

// 768px 以下
@media (max-width: 768px) {
  @for $i from 0 through 24 {
    .pilot-col-sm-#{$i} {
      width: (math.div($i, 24)) * 100%;
    }
    .pilot-col-sm-offset-#{$i} {
      margin-left: (math.div($i, 24)) * 100%;
    }
  }
}

// 768px 以上
@media (min-width: 768px) {
  @for $i from 0 through 24 {
    .pilot-col-md-#{$i} {
      width: (math.div($i, 24)) * 100%;
    }
    .pilot-col-md-offset-#{$i} {
      margin-left: (math.div($i, 24)) * 100%;
    }
  }
}

// 992px 以上
@media (min-width: 992px) {
  @for $i from 0 through 24 {
    .pilot-col-lg-#{$i} {
      width: (math.div($i, 24)) * 100%;
    }
    .pilot-col-lg-offset-#{$i} {
      margin-left: (math.div($i, 24)) * 100%;
    }
  }
}

// 1200px 以上
@media (min-width: 1200px) {
  @for $i from 0 through 24 {
    .pilot-col-xl-#{$i} {
      width: (math.div($i, 24)) * 100%;
    }
    .pilot-col-xl-offset-#{$i} {
      margin-left: (math.div($i, 24)) * 100%;
    }
  }
}
</style>
