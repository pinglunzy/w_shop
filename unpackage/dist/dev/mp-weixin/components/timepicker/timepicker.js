"use strict";
const common_vendor = require("../../common/vendor.js");
const Popup = () => "../uni-popup.js";
const _sfc_main = {
  components: {
    Popup
  },
  data() {
    return {
      /*宽度*/
      width: 750,
      height: 600,
      /*数据对象*/
      dataModel: {},
      minute: [
        "10",
        "25",
        "40",
        "55"
      ],
      hours: [
        {
          start: "00",
          end: "02"
        },
        {
          start: "02",
          end: "04"
        },
        {
          start: "04",
          end: "06"
        },
        {
          start: "06",
          end: "08"
        },
        {
          start: "08",
          end: "10"
        },
        {
          start: "10",
          end: "12"
        },
        {
          start: "12",
          end: "14"
        },
        {
          start: "14",
          end: "16"
        },
        {
          start: "16",
          end: "18"
        },
        {
          start: "18",
          end: "20"
        },
        {
          start: "20",
          end: "22"
        },
        {
          start: "22",
          end: "24"
        }
      ],
      myhours: "",
      myminute: "",
      pickhours: {
        start: "",
        end: ""
      },
      mealtime: ""
    };
  },
  props: ["isTimer"],
  onShow() {
  },
  watch: {
    "isTimer": function(n, o) {
      if (n != o) {
        this.getData();
      }
    }
  },
  methods: {
    /*获取数据*/
    getData() {
      let self = this;
      let myDate = /* @__PURE__ */ new Date();
      self.myhours = myDate.getHours();
      self.myminute = myDate.getMinutes();
      self.pickH(self.hours[self.myhours]);
      self.$nextTick(function() {
        self.hours.forEach((item, index) => {
          if (item.start <= self.myhours && self.myhours < item.end) {
            self.pickH(item);
          }
        });
      });
    },
    pickH(n) {
      this.pickhours = n;
    },
    /*关闭弹窗*/
    hidePopupFunc(e) {
      this.$emit("close", "");
    },
    picktime(n) {
      this.mealtime = n;
      this.$emit("close", this.mealtime);
    },
    inittime(n) {
      let time = n;
      time = n * 1 - 1;
      if (n <= 10) {
        return "0" + time;
      } else {
        return time;
      }
    },
    /*复制*/
    copyQQ(message) {
      var input = document.createElement("input");
      input.value = message;
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, input.value.length), document.execCommand("Copy");
      document.body.removeChild(input);
      common_vendor.index.showToast({
        title: "复制成功",
        icon: "success",
        mask: true,
        duration: 2e3
      });
    }
  }
};
if (!Array) {
  const _component_Popup = common_vendor.resolveComponent("Popup");
  _component_Popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.hours, (item, index, i0) => {
      return common_vendor.e({
        a: $data.myhours <= item.end
      }, $data.myhours <= item.end ? {
        b: common_vendor.t(item.start + ":00~" + item.end + ":00"),
        c: common_vendor.n($data.pickhours && item.start != $data.pickhours.start ? "hours" : "hours-active"),
        d: common_vendor.o(($event) => $options.pickH(item), index)
      } : {}, {
        e: index
      });
    }),
    b: common_vendor.f($data.minute, (item, index, i0) => {
      return common_vendor.e({
        a: $data.pickhours && $data.myhours >= $data.pickhours.start && $data.myminute <= item && $data.myhours != $options.inittime($data.pickhours.end)
      }, $data.pickhours && $data.myhours >= $data.pickhours.start && $data.myminute <= item && $data.myhours != $options.inittime($data.pickhours.end) ? {
        b: common_vendor.t($data.pickhours.start + ":" + item),
        c: common_vendor.o(($event) => $options.picktime($data.pickhours.start + ":" + item), index)
      } : {}, {
        d: index
      });
    }),
    c: common_vendor.f($data.minute, (item, index, i0) => {
      return common_vendor.e($data.pickhours && $data.myhours <= $data.pickhours.start && $data.myhours != $options.inittime($data.pickhours.end) ? {
        a: common_vendor.t($data.pickhours.start + ":" + item),
        b: common_vendor.o(($event) => $options.picktime($data.pickhours.start + ":" + item), index)
      } : {}, {
        c: index
      });
    }),
    d: $data.pickhours && $data.myhours <= $data.pickhours.start && $data.myhours != $options.inittime($data.pickhours.end),
    e: common_vendor.f($data.minute, (item, index, i0) => {
      return common_vendor.e($data.pickhours && $data.myhours != $options.inittime($data.pickhours.end) ? {
        a: common_vendor.t($options.inittime($data.pickhours.end) + ":" + item),
        b: common_vendor.o(($event) => $options.picktime($options.inittime($data.pickhours.end) + ":" + item), index)
      } : {}, {
        c: index
      });
    }),
    f: $data.pickhours && $data.myhours != $options.inittime($data.pickhours.end),
    g: common_vendor.f($data.minute, (item, index, i0) => {
      return common_vendor.e({
        a: $data.pickhours && $data.myminute <= item && $data.myhours == $options.inittime($data.pickhours.end)
      }, $data.pickhours && $data.myminute <= item && $data.myhours == $options.inittime($data.pickhours.end) ? {
        b: common_vendor.t($options.inittime($data.pickhours.end) + ":" + item),
        c: common_vendor.o(($event) => $options.picktime($options.inittime($data.pickhours.end) + ":" + item), index)
      } : {}, {
        d: index
      });
    }),
    h: common_vendor.o($options.hidePopupFunc),
    i: common_vendor.p({
      show: $props.isTimer,
      width: $data.width,
      height: $data.height,
      padding: 0,
      type: "bottom"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b3983eb7"], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/components/timepicker/timepicker.vue"]]);
wx.createComponent(Component);
