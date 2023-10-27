"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "popup-layer",
  model: {
    prop: "showPop",
    event: "change"
  },
  props: {
    showPop: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: "top"
      // 方向  top，bottom，left，right 
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      ifshow: false,
      // 是否展示,
      translateValue: -100,
      // 位移距离
      timer: null,
      iftoggle: false
    };
  },
  computed: {
    _translate() {
      const transformObj = {
        "top": `transform:translateY(${-this.translateValue}%)`,
        "bottom": `transform:translateY(${this.translateValue}%)`,
        "left": `transform:translateX(${-this.translateValue}%)`,
        "right": `transform:translateX(${this.translateValue}%)`
      };
      return transformObj[this.direction];
    },
    _location() {
      const positionValue = {
        "top": "bottom:env(safe-area-inset-bottom);width:100%;",
        "bottom": "top:0px;width:100%;",
        "left": "right:0px;height:100%;",
        "right": "left:0px;height:100%;"
      };
      return positionValue[this.direction] + this._translate;
    }
  },
  mounted() {
    if (this.showPop) {
      this.show();
    }
  },
  watch: {
    showPop(value) {
      if (value) {
        this.show();
      } else {
        this.close();
      }
    }
  },
  methods: {
    stopMove(event) {
      console.log(event);
      return;
    },
    show(events) {
      this.ifshow = true;
      setTimeout(() => {
        this.translateValue = 0;
      }, 100);
      setTimeout(() => {
        this.iftoggle = true;
      }, 300);
    },
    close() {
      if (this.timer !== null || !this.iftoggle) {
        return;
      }
      this.translateValue = -100;
      this.timer = setTimeout(() => {
        this.ifshow = false;
        this.timer = null;
        this.iftoggle = false;
        this.$emit("closeCallBack", null);
        this.$emit("change", false);
      }, 300);
    },
    ableClose() {
      if (this.autoClose) {
        this.close();
      }
    },
    stopEvent(event) {
    },
    doSome() {
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.ifshow
  }, $data.ifshow ? {
    b: common_vendor.o((...args) => $options.ableClose && $options.ableClose(...args)),
    c: common_vendor.o(() => {
    })
  } : {}, {
    d: common_vendor.o((...args) => $options.stopEvent && $options.stopEvent(...args)),
    e: common_vendor.s($options._location)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/components/popup-layer/popup-layer.vue"]]);
wx.createComponent(Component);
