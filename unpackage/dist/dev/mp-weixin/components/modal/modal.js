"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "Modal",
  props: {
    //是否显示
    show: {
      type: Boolean,
      default: false
    },
    //自定义modal体
    custom: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "100%"
    },
    padding: {
      type: String,
      default: "40rpx"
    },
    radius: {
      type: String,
      default: "24rpx"
    },
    //标题
    title: {
      type: String,
      default: ""
    },
    //内容
    content: {
      type: String,
      default: ""
    },
    //内容字体颜色
    color: {
      type: String,
      default: "#999"
    },
    //内容字体大小 rpx
    size: {
      type: Number,
      default: 28
    },
    //形状 circle, square
    shape: {
      type: String,
      default: "square"
    },
    button: {
      type: Array,
      default: function() {
        return [{
          text: "取消",
          type: "red",
          plain: true
          //是否空心
        }, {
          text: "确定",
          type: "red",
          plain: false
        }];
      }
    },
    //点击遮罩 是否可关闭
    maskClosable: {
      type: Boolean,
      default: true
    },
    //淡入效果，自定义弹框插入input输入框时传true
    fadein: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    handleClick(e) {
      if (!this.show)
        return;
      const dataset = e.currentTarget.dataset;
      this.$emit("click", {
        index: Number(dataset.index)
      });
    },
    handleClickCancel() {
      if (!this.maskClosable)
        return;
      this.$emit("cancel");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.custom
  }, $props.custom ? {} : common_vendor.e({
    b: $props.title
  }, $props.title ? {
    c: common_vendor.t($props.title)
  } : {}, {
    d: common_vendor.n($props.title ? "" : "mtop"),
    e: $props.color,
    f: $props.size + "rpx",
    g: common_vendor.f($props.button, (item, index, i0) => {
      return {
        a: common_vendor.t(item.text || "确定"),
        b: common_vendor.n("" + (item.type || "primary") + (item.plain ? "-outline" : "")),
        c: common_vendor.n("btn-" + (item.size || "default")),
        d: "" + (item.plain ? "outline" : item.type || "primary") + "-hover",
        e: index,
        f: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args), index),
        g: index
      };
    }),
    h: common_vendor.n($props.button.length != 2 ? "btn-width" : ""),
    i: common_vendor.n($props.button.length > 2 ? "mbtm" : ""),
    j: common_vendor.n($props.shape == "circle" ? "circle-btn" : ""),
    k: common_vendor.n($props.button.length != 2 ? "flex-column" : "")
  }), {
    l: $props.width,
    m: $props.padding,
    n: $props.radius,
    o: common_vendor.n($props.fadein || $props.show ? "modal-normal" : "modal-scale"),
    p: common_vendor.n($props.show ? "modal-show" : ""),
    q: common_vendor.n($props.show ? "mask-show" : ""),
    r: common_vendor.o((...args) => $options.handleClickCancel && $options.handleClickCancel(...args)),
    s: common_vendor.o(() => {
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/components/modal/modal.vue"]]);
wx.createComponent(Component);
