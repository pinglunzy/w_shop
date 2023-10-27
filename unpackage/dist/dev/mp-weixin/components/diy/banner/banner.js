"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      indicatorDots: true,
      autoplay: true,
      interval: 2e3,
      duration: 500,
      indicatorActiveColor: "#ffffff"
    };
  },
  props: ["itemData"],
  created() {
    this.interval = this.itemData.params.interval;
    this.indicatorActiveColor = this.itemData.style.btnColor;
  },
  methods: {
    /*跳转页面*/
    gotoPages(e) {
      this.gotoPage(e.linkUrl);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.itemData.data, (item, index, i0) => {
      return {
        a: item.imgUrl,
        b: index,
        c: common_vendor.o(($event) => $options.gotoPages(item), index)
      };
    }),
    b: $data.indicatorActiveColor,
    c: $data.autoplay,
    d: $data.interval,
    e: $data.duration,
    f: $props.itemData.params.nav[0].navimgUrl,
    g: common_vendor.t($props.itemData.params.nav[0].title),
    h: common_vendor.t($props.itemData.params.nav[0].text),
    i: common_vendor.o(($event) => _ctx.gotoPage("/" + $props.itemData.params.nav[0].navlinkUrl)),
    j: $props.itemData.params.nav[1].navimgUrl,
    k: common_vendor.t($props.itemData.params.nav[1].title),
    l: common_vendor.t($props.itemData.params.nav[1].text),
    m: common_vendor.o(($event) => _ctx.gotoPage("/" + $props.itemData.params.nav[1].navlinkUrl))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/components/diy/banner/banner.vue"]]);
wx.createComponent(Component);
