"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  props: ["itemData"],
  methods: {
    /*跳转页面*/
    gotoPages(e) {
      this.gotoPage(e.linkUrl);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.itemData.style.layout > -1
  }, $props.itemData.style.layout > -1 ? {
    b: common_vendor.f($props.itemData.data, (item, index, i0) => {
      return {
        a: item.imgUrl,
        b: index,
        c: common_vendor.o(($event) => $options.gotoPages(item), index)
      };
    }),
    c: $props.itemData.style.paddingTop + "px " + $props.itemData.style.paddingLeft + "px",
    d: common_vendor.n("column__" + $props.itemData.style.layout)
  } : common_vendor.e({
    e: $props.itemData.data[0].imgUrl,
    f: common_vendor.o(($event) => $options.gotoPages($props.itemData.data[0])),
    g: $props.itemData.data.length >= 2
  }, $props.itemData.data.length >= 2 ? {
    h: $props.itemData.data[1].imgUrl,
    i: common_vendor.o(($event) => $options.gotoPages($props.itemData.data[1]))
  } : {}, {
    j: $props.itemData.data.length >= 3
  }, $props.itemData.data.length >= 3 ? {
    k: $props.itemData.data[2].imgUrl,
    l: common_vendor.o(($event) => $options.gotoPages($props.itemData.data[2]))
  } : {}, {
    m: $props.itemData.data.length >= 4
  }, $props.itemData.data.length >= 4 ? {
    n: $props.itemData.data[3].imgUrl,
    o: common_vendor.o(($event) => $options.gotoPages($props.itemData.data[3]))
  } : {}, {
    p: $props.itemData.style.paddingTop + "px " + $props.itemData.style.paddingLeft + "px"
  }), {
    q: $props.itemData.style.background,
    r: $props.itemData.style.paddingTop + "px " + $props.itemData.style.paddingLeft + "px"
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/components/diy/window/window.vue"]]);
wx.createComponent(Component);
