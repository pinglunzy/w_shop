"use strict";
const common_vendor = require("../common/vendor.js");
function requestFun(app) {
  app.config.globalProperties._get = function(path, data, success, fail, complete) {
    console.log(this.websiteUrl, "llll");
    data = data || {};
    data.token = common_vendor.index.getStorageSync("token") || "";
    data.app_id = this.getAppId();
    common_vendor.index.request({
      url: this.websiteUrl + "/index.php/api/" + path,
      data,
      dataType: "json",
      method: "GET",
      header: {
        "appId": this.getAppId()
      },
      success: (res) => {
        if (res.statusCode !== 200 || typeof res.data !== "object") {
          return false;
        }
        if (res.data.code === -2) {
          this.showError(res.data.msg, function() {
            common_vendor.index.removeStorageSync("token");
          });
        } else if (res.data.code === -1) {
          console.log("登录态失效, 重新登录");
          this.doLogin();
        } else if (res.data.code === 0) {
          this.showError(res.data.msg, function() {
            fail && fail(res);
          });
          return false;
        } else {
          success && success(res.data);
        }
      },
      fail: (res) => {
        fail && fail(res);
      },
      complete: (res) => {
        common_vendor.index.hideLoading();
        complete && complete(res);
      }
    });
  };
  app.config.globalProperties._post = function(path, data, success, fail, complete) {
    data = data || {};
    data.token = common_vendor.index.getStorageSync("token") || "";
    data.app_id = this.getAppId();
    common_vendor.index.request({
      url: this.websiteUrl + "/index.php/api/" + path,
      data,
      dataType: "json",
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
        "appId": this.getAppId()
      },
      success: (res) => {
        if (res.statusCode !== 200 || typeof res.data !== "object") {
          return false;
        }
        if (res.data.code === -1) {
          console.log("登录态失效, 重新登录");
          this.doLogin();
        } else if (res.data.code === 0) {
          this.showError(res.data.msg, function() {
            fail && fail(res);
          });
          return false;
        } else {
          success && success(res.data);
        }
      },
      fail: (res) => {
        fail && fail(res);
      },
      complete: (res) => {
        common_vendor.index.hideLoading();
        complete && complete(res);
      }
    });
  };
  app.config.globalProperties.doLogin = function() {
    let pages = getCurrentPages();
    if (pages.length) {
      let currentPage = pages[pages.length - 1];
      if ("pages/login/login" != currentPage.route && "pages/login/weblogin" != currentPage.route && "pages/login/openlogin" != currentPage.route) {
        common_vendor.index.setStorageSync("currentPage", currentPage.route);
        common_vendor.index.setStorageSync("currentPageOptions", currentPage.options);
      }
    }
    console.log("app_ID=" + this.getAppId());
    this.gotoPage("/pages/login/login");
  };
}
exports.requestFun = requestFun;
