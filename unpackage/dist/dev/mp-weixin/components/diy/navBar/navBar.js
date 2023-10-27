"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      //单个宽度
      item_width: "",
      item_height: ""
    };
  },
  props: ["itemData"],
  created() {
    this.item_width = this.itemData.style.rowsNum == 1 ? "690rpx" : "330rpx";
    this.item_height = this.itemData.style.rowsNum == 1 ? "150rpx" : "254rpx";
  },
  methods: {
    /*跳转页面*/
    gotoDetail(path) {
      let self = this;
      console.log(path);
      if (path.startsWith("scanQrcode")) {
        self[path]();
      } else {
        self.gotoPage(path);
      }
    },
    /*扫一扫核销*/
    scanQrcode: function() {
      this.$emit("scanQrcode");
    }
    /*跳转页面*/
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.itemData.style.rowsNum == 1
  }, $props.itemData.style.rowsNum == 1 ? {
    b: common_vendor.f($props.itemData.data, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t(item.text),
        c: item.color,
        d: item.imageUrl,
        e: index,
        f: common_vendor.o(($event) => $options.gotoDetail(item.linkUrl), index)
      };
    })
  } : {}, {
    c: $props.itemData.style.rowsNum == 2
  }, $props.itemData.style.rowsNum == 2 ? {
    d: common_vendor.f($props.itemData.data, (item, index, i0) => {
      return {
        a: item.imageUrl,
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.text),
        d: item.color,
        e: index,
        f: common_vendor.o(($event) => $options.gotoDetail(item.linkUrl), index)
      };
    })
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/components/diy/navBar/navBar.vue"]]);
wx.createComponent(Component);
