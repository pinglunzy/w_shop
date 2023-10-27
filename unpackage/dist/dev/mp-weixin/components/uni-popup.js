"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      //top - 顶部， middle - 居中, bottom - 底部
      default: "middle"
    },
    width: {
      type: Number,
      default: 600
    },
    heigth: {
      type: Number,
      default: 800
    },
    padding: {
      type: Number,
      default: 30
    },
    backgroundColor: {
      type: String,
      default: "#ffffff"
    },
    boxShadow: {
      type: String,
      default: "0 0 30upx rgba(0, 0, 0, .1)"
    },
    msg: {
      type: String,
      default: ""
    }
  },
  data() {
    let offsetTop = 0;
    return {
      offsetTop
    };
  },
  methods: {
    hide: function() {
      this.$emit("hidePopup");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.show,
    b: $data.offsetTop + "px",
    c: common_vendor.o((...args) => $options.hide && $options.hide(...args)),
    d: $props.msg != ""
  }, $props.msg != "" ? {
    e: common_vendor.t($props.msg)
  } : {}, {
    f: common_vendor.n("uni-popup-" + $props.type),
    g: $props.show,
    h: common_vendor.s("width:" + $props.width + "rpx; heigth:" + $props.heigth + "rpx;padding:" + $props.padding + "rpx;background-color:" + $props.backgroundColor + ";box-shadow:" + $props.boxShadow + ";")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/components/uni-popup.vue"]]);
wx.createComponent(Component);
