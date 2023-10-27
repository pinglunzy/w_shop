"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_utils = require("../../../../common/utils.js");
const _sfc_main = {
  data() {
    return {
      urls: "",
      longitude: 0,
      latitude: 0,
      detail: 0,
      /*地址id*/
      address_id: 0,
      /*地址数据*/
      address: {
        name: "",
        phone: "",
        detail: "",
        address: ""
      },
      openWb: false,
      wburl: ""
    };
  },
  onLoad(e) {
    this.address_id = e.address_id;
    this.delta = e.delta || 1;
    if (e.module == "locationPicker") {
      this.address = common_vendor.index.getStorageSync("addressData");
      common_vendor.index.removeStorageSync("addressData");
      this.address.detail = e.addr;
      this.address.latitude = e.latng.split(",")[0];
      this.address.longitude = e.latng.split(",")[1];
    } else {
      this.getData();
    }
  },
  mounted() {
  },
  methods: {
    handlePostMessage(data) {
      console.log("接收到消息：" + JSON.stringify(data.detail));
    },
    /*获取数据*/
    getData() {
      let self = this;
      let address_id = self.address_id;
      self._get(
        "user.address/detail",
        {
          address_id
        },
        function(res) {
          self.address = res.data.detail;
          self.address_id = res.data.detail.address_id;
        }
      );
    },
    choseWx() {
      let self = this;
      let key = this.config.mpKey;
      let addressData = {
        name: self.address.name || "",
        phone: self.address.phone || "",
        address: self.address.address || ""
      };
      common_vendor.index.setStorageSync("addressData", addressData);
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
          common_vendor.index.setStorageSync("mpaddress", self.address);
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
    /*提交地址*/
    formSubmit: function(e) {
      let self = this;
      var formdata = e.detail.value;
      formdata.longitude = self.address.longitude;
      formdata.latitude = self.address.latitude;
      formdata.address_id = self.address_id;
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
      self._post("user.address/edit", formdata, function(res) {
        console.log(self.delta);
        self.showSuccess(res.msg, function() {
          common_vendor.index.navigateBack({
            delta: 1
          });
        });
      });
    },
    /*清空数据*/
    formReset: function(e) {
      console.log("清空数据");
    },
    /*三级联动选择*/
    showMulLinkageThreePicker() {
      this.$refs.mpvueCityPicker.show();
    },
    /*选择之后绑定*/
    onConfirm(e) {
      this.region = e.label.split(",");
      this.selectCity = e.label;
      this.province_id = e.cityCode[0];
      this.city_id = e.cityCode[1];
      this.region_id = e.cityCode[2];
    }
  }
};
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
    l: $data.openWb
  }, $data.openWb ? {
    m: $data.wburl,
    n: common_vendor.o((...args) => $options.handlePostMessage && $options.handlePostMessage(...args))
  } : {}, {
    o: _ctx.theme(),
    p: common_vendor.n(_ctx.theme() || "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/user/address/edit/edit.vue"]]);
wx.createPage(MiniProgramPage);
