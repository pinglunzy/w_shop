"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "load-more",
  props: {
    loadingType: {
      //上拉的状态：0-loading前；1-loading中；2-没有更多了
      type: Number,
      default: 0
    },
    showImage: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: "#999999"
    },
    contentText: {
      type: Object,
      default() {
        return {
          contentdown: "上拉显示更多",
          contentrefresh: "正在加载...",
          contentnomore: "已全部加载完成"
        };
      }
    }
  },
  data() {
    return {};
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.color,
    b: $props.color,
    c: $props.color,
    d: $props.color,
    e: $props.color,
    f: $props.color,
    g: $props.color,
    h: $props.color,
    i: $props.color,
    j: $props.color,
    k: $props.color,
    l: $props.color,
    m: $props.loadingType === 1 && $props.showImage,
    n: common_vendor.t($props.loadingType === 0 ? $props.contentText.contentdown : $props.loadingType === 1 ? $props.contentText.contentrefresh : $props.contentText.contentnomore),
    o: $props.color
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/components/uni-load-more.vue"]]);
wx.createComponent(Component);
