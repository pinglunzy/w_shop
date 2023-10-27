"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_utils = require("../../../../common/utils.js");
const mpvueCityPicker = () => "../../../../components/mpvue-citypicker/mpvueCityPicker.js";
const _sfc_main = {
  components: {
    mpvueCityPicker
  },
  data() {
    return {
      urls: "",
      cityPickerValueDefault: [0, 0, 0],
      selectCity: "选择省,市,区",
      province_id: 0,
      city_id: 0,
      region_id: 0,
      address: {
        latitude: "",
        longitude: "",
        detail: ""
      },
      delta: 1,
      signPackage: "",
      openWb: false,
      wburl: ""
    };
  },
  onLoad: function(options) {
    this.delta = options.delta || 1;
    if (options.module == "locationPicker") {
      this.address = common_vendor.index.getStorageSync("addressData");
      common_vendor.index.removeStorageSync("addressData");
      this.address.detail = options.addr;
      this.address.latitude = options.latng.split(",")[0];
      this.address.longitude = options.latng.split(",")[1];
    }
  },
  methods: {
    handlePostMessage(data) {
    },
    choseWx() {
      let self = this;
      let addressData = {
        name: self.address.name || "",
        phone: self.address.phone || "",
        address: self.address.address || ""
      };
      common_vendor.index.setStorageSync("addressData", addressData);
      let key = this.config.mpKey;
      let page = "https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=" + this.urls + "&key=" + key + "&referer=myapp";
      this.wburl = page;
      this.openWb = true;
    },
    chooseLocation(n) {
      let self = this;
      common_vendor.index.chooseLocation({
        success: function(res) {
          self.address.longitude = res.longitude;
          self.address.latitude = res.latitude;
          self.address.detail = res.address;
          console.log("位置名称：" + res.name);
          console.log("详细地址：" + res.address);
          console.log("纬度：" + res.latitude);
          console.log("经度：" + res.longitude);
        },
        fail(err) {
          common_vendor.index.setStorageSync("address", "");
          console.log(err);
        },
        complete(com) {
          console.log(com);
        }
      });
    },
    /*提交*/
    formSubmit: function(e) {
      let self = this;
      var formdata = e.detail.value;
      formdata.latitude = self.address.latitude;
      formdata.longitude = self.address.longitude;
      if (formdata.name == "") {
        common_vendor.index.showToast({
          title: "请输入收货人姓名",
          duration: 1e3,
          icon: "none"
        });
        return false;
      }
      if (!common_utils.utils.isTelAvailable(formdata.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的联系方式",
          duration: 2e3,
          icon: "none"
        });
        return;
      }
      if (formdata.latitude == 0 || formdata.longitude == 0) {
        if (formdata.detail == "") {
          common_vendor.index.showToast({
            title: "请选择正确的地址",
            duration: 1e3,
            icon: "none"
          });
          return false;
        }
      }
      self._post("user.address/add", formdata, function(res) {
        console.log(self.delta);
        self.showSuccess(res.msg, function() {
          common_vendor.index.navigateBack({
            delta: 1
          });
        });
      });
    },
    formReset: function(e) {
      console.log("清空数据");
    },
    /*三级联动选择*/
    showMulLinkageThreePicker() {
      this.$refs.mpvueCityPicker.show();
    },
    /*确定选择的省市区*/
    onConfirm(e) {
      this.selectCity = e.label;
      this.province_id = e.cityCode[0];
      this.city_id = e.cityCode[1];
      this.region_id = e.cityCode[2];
    }
  }
};
if (!Array) {
  const _component_mpvue_city_picker = common_vendor.resolveComponent("mpvue-city-picker");
  _component_mpvue_city_picker();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.address.name,
    b: common_vendor.o(($event) => $data.address.name = $event.detail.value),
    c: $data.address.phone,
    d: common_vendor.o(($event) => $data.address.phone = $event.detail.value),
    e: $data.address.detail,
    f: common_vendor.o(($event) => $data.address.detail = $event.detail.value),
    g: common_vendor.o((...args) => $options.chooseLocation && $options.chooseLocation(...args)),
    h: $data.address.address,
    i: common_vendor.o(($event) => $data.address.address = $event.detail.value),
    j: common_vendor.o((...args) => $options.formSubmit && $options.formSubmit(...args)),
    k: common_vendor.o((...args) => $options.formReset && $options.formReset(...args)),
    l: common_vendor.sr("mpvueCityPicker", "56849bce-0"),
    m: common_vendor.o($options.onConfirm),
    n: common_vendor.p({
      pickerValueDefault: $data.cityPickerValueDefault
    }),
    o: $data.openWb
  }, $data.openWb ? {
    p: $data.wburl,
    q: common_vendor.o((...args) => $options.handlePostMessage && $options.handlePostMessage(...args))
  } : {}, {
    r: _ctx.theme(),
    s: common_vendor.n(_ctx.theme() || "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/user/address/add/add.vue"]]);
wx.createPage(MiniProgramPage);
