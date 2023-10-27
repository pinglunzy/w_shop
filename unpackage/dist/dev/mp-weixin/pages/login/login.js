"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      background: "",
      listData: [],
      invitation_id: 0
    };
  },
  onShow() {
  },
  onLoad(e) {
    this.invitation_id = common_vendor.index.getStorageSync("invitation_id") || 0;
  },
  methods: {
    onNotLogin: function() {
      this.gotoPage("/pages/index/index");
    },
    getUserInfo: function() {
      let self = this;
      common_vendor.wx$1.getUserProfile({
        lang: "zh_CN",
        desc: "用于完善会员资料",
        success: (res) => {
          if (res.errMsg !== "getUserProfile:ok") {
            return false;
          }
          common_vendor.index.showLoading({
            title: "正在登录",
            mask: true
          });
          common_vendor.wx$1.login({
            success(res_login) {
              self._post("user.user/login", {
                invitation_id: self.invitation_id,
                code: res_login.code,
                user_info: res.rawData,
                encrypted_data: encodeURIComponent(res.encryptedData),
                iv: encodeURIComponent(res.iv),
                signature: res.signature,
                referee_id: common_vendor.index.getStorageSync("referee_id"),
                source: "wx"
              }, (result) => {
                common_vendor.index.setStorageSync("token", result.data.token);
                common_vendor.index.setStorageSync("user_id", result.data.user_id);
                common_vendor.index.navigateBack();
              }, false, () => {
                common_vendor.index.hideLoading();
              });
            }
          });
        }
      });
    },
    onGetAuthorize(res) {
      console.log("开始授权");
      let self = this;
      common_vendor.index.login({
        provider: "alipay",
        success: function(loginRes) {
          console.log("sucss");
          console.log(loginRes);
          common_vendor.index.getUserInfo({
            provider: "alipay",
            success: function(infoRes) {
              self.aliPayLogin(loginRes, infoRes);
            }
          });
        },
        fail(err) {
          console.log(err);
        }
      });
    },
    aliPayLogin(loginRes, infoRes) {
      let self = this;
      console.log(loginRes);
      console.log(infoRes);
      common_vendor.index.showLoading({
        title: "登录中",
        mask: true
      });
      self._post("user.useralipay/login", {
        code: loginRes.authCode,
        avatar: infoRes.avatar,
        nickName: infoRes.nickName
      }, (result) => {
        common_vendor.index.setStorageSync("token", result.data.token);
        common_vendor.index.setStorageSync("user_id", result.data.user_id);
        common_vendor.index.navigateBack();
      }, false, () => {
        common_vendor.index.hideLoading();
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.getUserInfo && $options.getUserInfo(...args)),
    b: common_vendor.o((...args) => $options.onNotLogin && $options.onNotLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
