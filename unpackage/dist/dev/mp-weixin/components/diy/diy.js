"use strict";
const common_vendor = require("../../common/vendor.js");
const banner = () => "./banner/banner.js";
const windows = () => "./window/window.js";
const navBar = () => "./navBar/navBar.js";
const blank = () => "./blank/blank.js";
const guide = () => "./guide/guide.js";
const _sfc_main = {
  components: {
    banner,
    windows,
    navBar,
    blank,
    guide
  },
  data() {
    return {};
  },
  props: ["diyItems"],
  created() {
  },
  methods: {
    scanQrcode() {
      this.$emit("scanQrcode");
    }
  }
};
if (!Array) {
  const _component_banner = common_vendor.resolveComponent("banner");
  const _component_windows = common_vendor.resolveComponent("windows");
  const _component_navBar = common_vendor.resolveComponent("navBar");
  const _component_blank = common_vendor.resolveComponent("blank");
  const _component_guide = common_vendor.resolveComponent("guide");
  (_component_banner + _component_windows + _component_navBar + _component_blank + _component_guide)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.diyItems, (item, index, i0) => {
      return common_vendor.e({
        a: item.type === "banner" && item.data != null
      }, item.type === "banner" && item.data != null ? {
        b: "dea6200c-0-" + i0,
        c: common_vendor.p({
          itemData: item
        })
      } : {}, {
        d: item.type == "window" && item.data != null
      }, item.type == "window" && item.data != null ? {
        e: "dea6200c-1-" + i0,
        f: common_vendor.p({
          itemData: item
        })
      } : {}, {
        g: item.type === "navBar" && item.data != null
      }, item.type === "navBar" && item.data != null ? {
        h: common_vendor.o($options.scanQrcode, index),
        i: "dea6200c-2-" + i0,
        j: common_vendor.p({
          itemData: item
        })
      } : {}, {
        k: item.type == "blank"
      }, item.type == "blank" ? {
        l: "dea6200c-3-" + i0,
        m: common_vendor.p({
          itemData: item
        })
      } : {}, {
        n: item.type == "guide"
      }, item.type == "guide" ? {
        o: "dea6200c-4-" + i0,
        p: common_vendor.p({
          itemData: item
        })
      } : {}, {
        q: index
      });
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/components/diy/diy.vue"]]);
wx.createComponent(Component);
