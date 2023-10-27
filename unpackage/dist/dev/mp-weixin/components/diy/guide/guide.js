"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  props: ["itemData"],
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.itemData.style.lineHeight + "px",
    b: $props.itemData.style.lineColor,
    c: $props.itemData.style.lineStyle,
    d: $props.itemData.style.paddingTop + "px 0",
    e: $props.itemData.style.background
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/components/diy/guide/guide.vue"]]);
wx.createComponent(Component);
