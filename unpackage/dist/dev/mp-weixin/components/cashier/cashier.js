"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      checkedPay: [10, 20],
      pay_type: 10
    };
  },
  props: ["isPayPopup"],
  methods: {
    hidePopupFunc(e) {
      this.$emit("close", e);
    },
    payTypeFunc(e) {
      this.pay_type = e;
    },
    subFunc() {
      this.$emit("submit", this.pay_type);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.hidePopupFunc(null)),
    b: common_vendor.f($data.checkedPay, (item, index, i0) => {
      return common_vendor.e({
        a: item == 20
      }, item == 20 ? {} : {}, {
        b: item == 30
      }, item == 30 ? {} : {}, {
        c: item == 10
      }, item == 10 ? {} : {}, {
        d: common_vendor.n($data.pay_type == item ? "active" : ""),
        e: common_vendor.o(($event) => $options.payTypeFunc(item), index),
        f: index
      });
    }),
    c: common_vendor.o((...args) => $options.subFunc && $options.subFunc(...args)),
    d: common_vendor.o(() => {
    }),
    e: common_vendor.n($props.isPayPopup ? "pop-bg open cashier-pop" : "pop-bg close cashier-pop"),
    f: common_vendor.o(() => {
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/components/cashier/cashier.vue"]]);
wx.createComponent(Component);
