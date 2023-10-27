"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      background: "",
      listData: [],
      sessionKey: ""
    };
  },
  onLoad() {
    let self = this;
    common_vendor.wx$1.login({
      success(res) {
        self._post("user.user/getSession", {
          code: res.code
        }, (result) => {
          self.sessionKey = result.data.session_key;
        });
      }
    });
  },
  methods: {
    onNotLogin: function() {
      this.gotoPage("/pages/index/index");
    },
    getPhoneNumber(e) {
      var self = this;
      if (e.detail.errMsg !== "getPhoneNumber:ok") {
        return false;
      }
      common_vendor.index.showLoading({
        title: "正在处理",
        mask: true
      });
      common_vendor.wx$1.login({
        success(res) {
          self._post("user.user/bindMobile", {
            session_key: self.sessionKey,
            encrypted_data: e.detail.encryptedData,
            iv: e.detail.iv
          }, (result) => {
            common_vendor.index.hideLoading();
            common_vendor.index.navigateBack();
          }, false, () => {
            common_vendor.index.hideLoading();
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.getPhoneNumber && $options.getPhoneNumber(...args)),
    b: common_vendor.o((...args) => $options.onNotLogin && $options.onNotLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/login/bindmobile.vue"]]);
wx.createPage(MiniProgramPage);
