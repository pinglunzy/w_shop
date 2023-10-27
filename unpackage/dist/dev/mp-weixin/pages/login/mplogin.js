"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  onLoad(options) {
    common_vendor.index.setStorageSync("token", options.token);
    common_vendor.index.setStorageSync("user_id", options.user_id);
    let url = "/" + common_vendor.index.getStorageSync("currentPage");
    let pageOptions = common_vendor.index.getStorageSync("currentPageOptions");
    if (Object.keys(pageOptions).length > 0) {
      url += "?";
      for (let i in pageOptions) {
        url += i + "=" + pageOptions[i] + "&";
      }
      url = url.substring(0, url.length - 1);
    }
    common_vendor.index.reLaunch({
      url
    });
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "F:/shop_app/jjjfood-master/jjj_food_chain_app/pages/login/mplogin.vue"]]);
wx.createPage(MiniProgramPage);
